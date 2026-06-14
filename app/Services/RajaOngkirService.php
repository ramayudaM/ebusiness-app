<?php

namespace App\Services;

use App\Models\RajaOngkirCache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class RajaOngkirService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('rajaongkir.api_key');
        $this->baseUrl = rtrim(config('rajaongkir.base_url', 'https://api.rajaongkir.com/starter'), '/');
    }

    public function getProvinces()
    {
        $cacheKey = 'rajaongkir:provinces';
        $cache = RajaOngkirCache::where('cache_key', $cacheKey)->first();
        
        if ($cache && $cache->expires_at && $cache->expires_at->isFuture()) {
            return $cache->cache_value;
        }

        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
                'User-Agent' => 'NadaKita/1.0'
            ])->get("{$this->baseUrl}/province");

            if ($response->successful()) {
                $provinces = $response->json()['rajaongkir']['results'] ?? [];
                if (!empty($provinces)) {
                    RajaOngkirCache::updateOrCreate(
                        ['cache_key' => $cacheKey],
                        ['cache_value' => $provinces, 'expires_at' => now()->addDays(30)]
                    );
                    return $provinces;
                }
            }
        } catch (\Exception $e) {
            Log::error('RajaOngkir Provinces API failed: ' . $e->getMessage());
        }

        // Fallback to expired cache if API fails
        if ($cache) {
            return $cache->cache_value;
        }

        // Fallback to local file if exists
        $filePath = storage_path('app/rajaongkir_provinces.json');
        if (file_exists($filePath)) {
            $json = file_get_contents($filePath);
            return json_decode($json, true)['rajaongkir']['results'] ?? [];
        }

        return [];
    }

    public function getCities($provinceId)
    {
        $cacheKey = "rajaongkir:cities:{$provinceId}";
        $cache = RajaOngkirCache::where('cache_key', $cacheKey)->first();
        
        if ($cache && $cache->expires_at && $cache->expires_at->isFuture()) {
            return $cache->cache_value;
        }

        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
                'User-Agent' => 'NadaKita/1.0'
            ])->get("{$this->baseUrl}/city", ['province' => $provinceId]);

            if ($response->successful()) {
                $cities = $response->json()['rajaongkir']['results'] ?? [];
                if (!empty($cities)) {
                    RajaOngkirCache::updateOrCreate(
                        ['cache_key' => $cacheKey],
                        ['cache_value' => $cities, 'expires_at' => now()->addDays(30)]
                    );
                    return $cities;
                }
            }
        } catch (\Exception $e) {
            Log::error("RajaOngkir Cities API failed for province {$provinceId}: " . $e->getMessage());
        }

        // Fallback to expired cache if API fails
        if ($cache) {
            return $cache->cache_value;
        }

        // Fallback to local file if exists
        $filePath = storage_path('app/rajaongkir_cities.json');
        if (file_exists($filePath)) {
            $json = file_get_contents($filePath);
            $allCities = json_decode($json, true)['rajaongkir']['results'] ?? [];
            $filtered = array_values(array_filter($allCities, function($city) use ($provinceId) {
                return $city['province_id'] == $provinceId;
            }));
            
            if (!empty($filtered)) {
                return $filtered;
            }
        }

        return [];
    }

    public function calculateCost($destinationCityId, $weight, $courier)
    {
        return $this->calculateCosts($destinationCityId, $weight, [$courier]);
    }

    public function calculateCosts($destinationCityId, $weight, array $couriers)
    {
        $origin = (int) config('rajaongkir.origin_city_id', 151);
        $results = [];
        $uncachedCouriers = [];

        // 1. Try to load from Cache first
        foreach ($couriers as $courier) {
            $cacheKey = "rajaongkir:cost:{$origin}:{$destinationCityId}:{$weight}:{$courier}";
            if (Cache::has($cacheKey)) {
                Log::debug("RajaOngkir cost cache hit for {$courier} from {$origin} to {$destinationCityId}");
                $results[$courier] = Cache::get($cacheKey);
            } else {
                $uncachedCouriers[] = $courier;
            }
        }

        // 2. Fetch uncached couriers in parallel
        if (!empty($uncachedCouriers)) {
            try {
                $responses = Http::pool(function ($pool) use ($uncachedCouriers, $origin, $destinationCityId, $weight) {
                    $requests = [];
                    foreach ($uncachedCouriers as $courier) {
                        $payload = [
                            'origin' => $origin,
                            'destination' => (int) $destinationCityId,
                            'weight' => (int) $weight,
                            'courier' => $courier
                        ];
                        $requests[$courier] = $pool->as($courier)
                            ->timeout(10)
                            ->withHeaders([
                                'key' => $this->apiKey,
                                'User-Agent' => 'NadaKita/1.0'
                            ])->post("{$this->baseUrl}/cost", $payload);
                    }
                    return $requests;
                });

                foreach ($uncachedCouriers as $courier) {
                    $response = $responses[$courier] ?? null;
                    $courierResults = [];

                    if ($response instanceof \Illuminate\Http\Client\Response && $response->successful()) {
                        $courierResults = $response->json()['rajaongkir']['results'] ?? [];
                    } else {
                        // Fallback HTTP
                        try {
                            $httpUrl = str_replace('https://', 'http://', $this->baseUrl);
                            $payload = [
                                'origin' => $origin,
                                'destination' => (int) $destinationCityId,
                                'weight' => (int) $weight,
                                'courier' => $courier
                            ];
                            $fallbackResponse = Http::timeout(10)
                                ->withHeaders([
                                    'key' => $this->apiKey,
                                    'User-Agent' => 'NadaKita/1.0'
                                ])->post("{$httpUrl}/cost", $payload);

                            if ($fallbackResponse->successful()) {
                                $courierResults = $fallbackResponse->json()['rajaongkir']['results'] ?? [];
                            }
                        } catch (\Exception $fallbackEx) {
                            Log::warning("RajaOngkir fallback failed for {$courier}: " . $fallbackEx->getMessage());
                        }
                    }

                    if (!empty($courierResults)) {
                        $cacheKey = "rajaongkir:cost:{$origin}:{$destinationCityId}:{$weight}:{$courier}";
                        Cache::put($cacheKey, $courierResults, now()->addHours(12));
                        $results[$courier] = $courierResults;
                    } else {
                        Log::info("RajaOngkir returning empty results for {$courier} to {$destinationCityId}, providing mock fallback.");
                        $results[$courier] = $this->getMockCost($courier, $weight);
                    }
                }
            } catch (\Exception $e) {
                Log::warning('RajaOngkir Concurrent Cost API failed: ' . $e->getMessage());
                foreach ($uncachedCouriers as $courier) {
                    $results[$courier] = $this->getMockCost($courier, $weight);
                }
            }
        }

        // 3. Combine results
        $combinedResults = [];
        foreach ($couriers as $courier) {
            if (isset($results[$courier])) {
                $combinedResults = array_merge($combinedResults, $results[$courier]);
            }
        }

        return $combinedResults;
    }

    private function getMockCost($courier, $weight)
    {
        return [
            [
                'code' => $courier,
                'name' => strtoupper($courier) . ' (Simulasi)',
                'costs' => [
                    [
                        'service' => 'REG',
                        'description' => 'Layanan Reguler (Simulasi)',
                        'cost' => [
                            [
                                'value' => 15000 * ceil($weight / 1000),
                                'etd' => '2-3',
                                'note' => ''
                            ]
                        ]
                    ],
                    [
                        'service' => 'YES',
                        'description' => 'Yakin Esok Sampai (Simulasi)',
                        'cost' => [
                            [
                                'value' => 25000 * ceil($weight / 1000),
                                'etd' => '1-1',
                                'note' => ''
                            ]
                        ]
                    ]
                ]
            ]
        ];
    }
}
