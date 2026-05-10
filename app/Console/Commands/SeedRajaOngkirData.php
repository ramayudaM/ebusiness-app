<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\RajaOngkirCache;
use Illuminate\Support\Facades\Http;

class SeedRajaOngkirData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rajaongkir:seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and cache all provinces and cities from RajaOngkir API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $apiKey = config('rajaongkir.api_key');
        $baseUrl = rtrim(config('rajaongkir.base_url'), '/');

        $this->info('Starting RajaOngkir data seeding...');

        // 1. Fetch Provinces
        $this->info('Fetching provinces...');
        $provinces = $this->fetchData("{$baseUrl}/province", $apiKey);
        
        if (!$provinces) {
            // Try fallback to http if https failed
            $httpUrl = str_replace('https://', 'http://', $baseUrl);
            $this->warn("Retrying with HTTP fallback: {$httpUrl}/province");
            $provinces = $this->fetchData("{$httpUrl}/province", $apiKey);
        }

        // Try local file fallback if API failed
        if (!$provinces && file_exists(storage_path('app/rajaongkir_provinces.json'))) {
            $this->warn("API failed. Using local provinces file...");
            $localData = json_decode(file_get_contents(storage_path('app/rajaongkir_provinces.json')), true);
            $provinces = $localData['rajaongkir']['results'] ?? null;
        }

        if ($provinces) {
            RajaOngkirCache::updateOrCreate(
                ['cache_key' => 'rajaongkir:provinces'],
                ['cache_value' => $provinces, 'expires_at' => now()->addYears(1)]
            );
            $this->info('Provinces cached successfully: ' . count($provinces));
        } else {
            $this->error('Failed to fetch provinces from API and local storage.');
            return 1;
        }

        // 2. Fetch All Cities
        $this->info('Fetching all cities...');
        $cities = $this->fetchData("{$baseUrl}/city", $apiKey);

        if (!$cities) {
            $httpUrl = str_replace('https://', 'http://', $baseUrl);
            $this->warn("Retrying with HTTP fallback: {$httpUrl}/city");
            $cities = $this->fetchData("{$httpUrl}/city", $apiKey);
        }

        // Try local file fallback if API failed
        if (!$cities && file_exists(storage_path('app/rajaongkir_cities.json'))) {
            $this->warn("API failed. Using local cities file...");
            $localData = json_decode(file_get_contents(storage_path('app/rajaongkir_cities.json')), true);
            $cities = $localData['rajaongkir']['results'] ?? null;
        }

        if ($cities) {
            // Group cities by province_id
            $groupedCities = [];
            foreach ($cities as $city) {
                $groupedCities[$city['province_id']][] = $city;
            }

            foreach ($groupedCities as $provinceId => $provinceCities) {
                RajaOngkirCache::updateOrCreate(
                    ['cache_key' => "rajaongkir:cities:{$provinceId}"],
                    ['cache_value' => $provinceCities, 'expires_at' => now()->addYears(1)]
                );
            }
            $this->info('Cities cached successfully: ' . count($cities) . ' in ' . count($groupedCities) . ' provinces');
        } else {
            $this->error('Failed to fetch cities from API and local storage.');
            return 1;
        }

        $this->info('RajaOngkir data seeding completed!');
        return 0;
    }

    private function fetchData($url, $apiKey)
    {
        if (!$apiKey) return null;
        
        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'key' => $apiKey,
                    'User-Agent' => 'NadaKita/1.0'
                ])->get($url);

            if ($response->successful()) {
                return $response->json()['rajaongkir']['results'] ?? null;
            }
        } catch (\Exception $e) {
            $this->warn("Request to {$url} failed: " . $e->getMessage());
        }

        return null;
    }
}
