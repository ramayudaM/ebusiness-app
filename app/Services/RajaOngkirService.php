<?php

namespace App\Services;

use App\Models\RajaOngkirCache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
        $cache = RajaOngkirCache::where('cache_key', 'rajaongkir:provinces')->first();
        if ($cache) {
            return $cache->cache_value;
        }

        $filePath = storage_path('app/rajaongkir_provinces.json');
        if (file_exists($filePath)) {
            $json = file_get_contents($filePath);
            return json_decode($json, true)['rajaongkir']['results'] ?? [];
        }
        return [];
    }

    public function getCities($provinceId)
    {
        $cache = RajaOngkirCache::where('cache_key', "rajaongkir:cities:{$provinceId}")->first();
        if ($cache) {
            return $cache->cache_value;
        }

        $filePath = storage_path('app/rajaongkir_cities.json');
        if (file_exists($filePath)) {
            $json = file_get_contents($filePath);
            $cities = json_decode($json, true)['rajaongkir']['results'] ?? [];
            return array_values(array_filter($cities, function($city) use ($provinceId) {
                return $city['province_id'] == $provinceId;
            }));
        }
        return [];
    }

    public function calculateCost($destinationCityId, $weight, $courier)
    {
        try {
            $response = Http::timeout(5)
                ->retry(2, 100)
                ->withHeaders([
                    'key' => $this->apiKey,
                    'User-Agent' => 'NadaKita/1.0'
                ])->post("{$this->baseUrl}/cost", [
                    'origin' => (int) config('rajaongkir.origin_city_id', 151),
                    'destination' => (int) $destinationCityId,
                    'weight' => (int) $weight,
                    'courier' => $courier
                ]);

            if ($response->successful()) {
                return $response->json()['rajaongkir']['results'] ?? [];
            }
        } catch (\Exception $e) {
            Log::warning('RajaOngkir Cost API failed, using MOCK fallback: ' . $e->getMessage());
        }

        // MOCK FALLBACK DATA SO CHECKOUT CAN PROCEED
        return [
            [
                'code' => $courier,
                'name' => strtoupper($courier) . ' (Mock Data)',
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
