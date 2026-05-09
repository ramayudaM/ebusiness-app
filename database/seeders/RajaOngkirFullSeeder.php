<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RajaOngkirCache;

class RajaOngkirFullSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            ['province_id' => '1', 'province' => 'Bali'],
            ['province_id' => '2', 'province' => 'Bangka Belitung'],
            ['province_id' => '3', 'province' => 'Banten'],
            ['province_id' => '4', 'province' => 'Bengkulu'],
            ['province_id' => '5', 'province' => 'DI Yogyakarta'],
            ['province_id' => '6', 'province' => 'DKI Jakarta'],
            ['province_id' => '7', 'province' => 'Gorontalo'],
            ['province_id' => '8', 'province' => 'Jambi'],
            ['province_id' => '9', 'province' => 'Jawa Barat'],
            ['province_id' => '10', 'province' => 'Jawa Tengah'],
            ['province_id' => '11', 'province' => 'Jawa Timur'],
            ['province_id' => '12', 'province' => 'Kalimantan Barat'],
            ['province_id' => '13', 'province' => 'Kalimantan Selatan'],
            ['province_id' => '14', 'province' => 'Kalimantan Tengah'],
            ['province_id' => '15', 'province' => 'Kalimantan Timur'],
            ['province_id' => '16', 'province' => 'Kalimantan Utara'],
            ['province_id' => '17', 'province' => 'Kepulauan Riau'],
            ['province_id' => '18', 'province' => 'Lampung'],
            ['province_id' => '19', 'province' => 'Maluku'],
            ['province_id' => '20', 'province' => 'Maluku Utara'],
            ['province_id' => '21', 'province' => 'Nanggroe Aceh Darussalam (NAD)'],
            ['province_id' => '22', 'province' => 'Nusa Tenggara Barat (NTB)'],
            ['province_id' => '23', 'province' => 'Nusa Tenggara Timur (NTT)'],
            ['province_id' => '24', 'province' => 'Papua'],
            ['province_id' => '25', 'province' => 'Papua Barat'],
            ['province_id' => '26', 'province' => 'Riau'],
            ['province_id' => '27', 'province' => 'Sulawesi Barat'],
            ['province_id' => '28', 'province' => 'Sulawesi Selatan'],
            ['province_id' => '29', 'province' => 'Sulawesi Tengah'],
            ['province_id' => '30', 'province' => 'Sulawesi Tenggara'],
            ['province_id' => '31', 'province' => 'Sulawesi Utara'],
            ['province_id' => '32', 'province' => 'Sumatera Barat'],
            ['province_id' => '33', 'province' => 'Sumatera Selatan'],
            ['province_id' => '34', 'province' => 'Sumatera Utara'],
        ];

        RajaOngkirCache::updateOrCreate(
            ['cache_key' => 'rajaongkir:provinces'],
            ['cache_value' => $provinces, 'expires_at' => now()->addYears(1)]
        );

        // Seed some common cities for DKI Jakarta (ID: 6)
        $jakartaCities = [
            ['city_id' => '151', 'province_id' => '6', 'province' => 'DKI Jakarta', 'type' => 'Kota', 'city_name' => 'Jakarta Barat', 'postal_code' => '11220'],
            ['city_id' => '152', 'province_id' => '6', 'province' => 'DKI Jakarta', 'type' => 'Kota', 'city_name' => 'Jakarta Pusat', 'postal_code' => '10110'],
            ['city_id' => '153', 'province_id' => '6', 'province' => 'DKI Jakarta', 'type' => 'Kota', 'city_name' => 'Jakarta Selatan', 'postal_code' => '12110'],
            ['city_id' => '154', 'province_id' => '6', 'province' => 'DKI Jakarta', 'type' => 'Kota', 'city_name' => 'Jakarta Timur', 'postal_code' => '13110'],
            ['city_id' => '155', 'province_id' => '6', 'province' => 'DKI Jakarta', 'type' => 'Kota', 'city_name' => 'Jakarta Utara', 'postal_code' => '14110'],
        ];

        RajaOngkirCache::updateOrCreate(
            ['cache_key' => 'rajaongkir:cities:6'],
            ['cache_value' => $jakartaCities, 'expires_at' => now()->addYears(1)]
        );

        // Seed common cities for Jawa Timur (ID: 11)
        $jatimCities = [
            ['city_id' => '444', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Surabaya', 'postal_code' => '60111'],
            ['city_id' => '255', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Malang', 'postal_code' => '65111'],
            ['city_id' => '135', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Kediri', 'postal_code' => '64125'],
            ['city_id' => '409', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Sidoarjo', 'postal_code' => '61212'],
            ['city_id' => '160', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Gresik', 'postal_code' => '61111'],
            ['city_id' => '289', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Mojokerto', 'postal_code' => '61311'],
            ['city_id' => '247', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Madiun', 'postal_code' => '63111'],
            ['city_id' => '178', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Jember', 'postal_code' => '68111'],
            ['city_id' => '42', 'province_id' => '11', 'province' => 'Jawa Timur', 'type' => 'Kabupaten', 'city_name' => 'Banyuwangi', 'postal_code' => '68411'],
        ];

        RajaOngkirCache::updateOrCreate(
            ['cache_key' => 'rajaongkir:cities:11'],
            ['cache_value' => $jatimCities, 'expires_at' => now()->addYears(1)]
        );
        
        // Seed common cities for Jawa Barat (ID: 9)
        $jabarCities = [
            ['city_id' => '23', 'province_id' => '9', 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Bandung', 'postal_code' => '40111'],
            ['city_id' => '54', 'province_id' => '9', 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Bekasi', 'postal_code' => '17111'],
            ['city_id' => '115', 'province_id' => '9', 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Depok', 'postal_code' => '16411'],
            ['city_id' => '78', 'province_id' => '9', 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Bogor', 'postal_code' => '16111'],
            ['city_id' => '107', 'province_id' => '9', 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Cimahi', 'postal_code' => '40511'],
            ['city_id' => '109', 'province_id' => '9', 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Cirebon', 'postal_code' => '45111'],
            ['city_id' => '430', 'province_id' => '9', 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Sukabumi', 'postal_code' => '43111'],
            ['city_id' => '457', 'province_id' => '9', 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Tasikmalaya', 'postal_code' => '46111'],
        ];

        RajaOngkirCache::updateOrCreate(
            ['cache_key' => 'rajaongkir:cities:9'],
            ['cache_value' => $jabarCities, 'expires_at' => now()->addYears(1)]
        );

        // Seed common cities for Jawa Tengah (ID: 10)
        $jatengCities = [
            ['city_id' => '399', 'province_id' => '10', 'province' => 'Jawa Tengah', 'type' => 'Kota', 'city_name' => 'Semarang', 'postal_code' => '50111'],
            ['city_id' => '445', 'province_id' => '10', 'province' => 'Jawa Tengah', 'type' => 'Kota', 'city_name' => 'Surakarta (Solo)', 'postal_code' => '57111'],
            ['city_id' => '249', 'province_id' => '10', 'province' => 'Jawa Tengah', 'type' => 'Kota', 'city_name' => 'Magelang', 'postal_code' => '56111'],
            ['city_id' => '349', 'province_id' => '10', 'province' => 'Jawa Tengah', 'type' => 'Kota', 'city_name' => 'Pekalongan', 'postal_code' => '51111'],
            ['city_id' => '396', 'province_id' => '10', 'province' => 'Jawa Tengah', 'type' => 'Kota', 'city_name' => 'Salatiga', 'postal_code' => '50711'],
            ['city_id' => '469', 'province_id' => '10', 'province' => 'Jawa Tengah', 'type' => 'Kota', 'city_name' => 'Tegal', 'postal_code' => '52111'],
            ['city_id' => '105', 'province_id' => '10', 'province' => 'Jawa Tengah', 'type' => 'Kabupaten', 'city_name' => 'Cilacap', 'postal_code' => '53211'],
            ['city_id' => '37', 'province_id' => '10', 'province' => 'Jawa Tengah', 'type' => 'Kabupaten', 'city_name' => 'Banyumas (Purwokerto)', 'postal_code' => '53111'],
        ];

        RajaOngkirCache::updateOrCreate(
            ['cache_key' => 'rajaongkir:cities:10'],
            ['cache_value' => $jatengCities, 'expires_at' => now()->addYears(1)]
        );

        // Seed common cities for Bali (ID: 1)
        $baliCities = [
            ['city_id' => '114', 'province_id' => '1', 'province' => 'Bali', 'type' => 'Kota', 'city_name' => 'Denpasar', 'postal_code' => '80111'],
            ['city_id' => '17', 'province_id' => '1', 'province' => 'Bali', 'type' => 'Kabupaten', 'city_name' => 'Badung', 'postal_code' => '80351'],
            ['city_id' => '161', 'province_id' => '1', 'province' => 'Bali', 'type' => 'Kabupaten', 'city_name' => 'Gianyar', 'postal_code' => '80511'],
        ];

        RajaOngkirCache::updateOrCreate(
            ['cache_key' => 'rajaongkir:cities:1'],
            ['cache_value' => $baliCities, 'expires_at' => now()->addYears(1)]
        );
    }
}
