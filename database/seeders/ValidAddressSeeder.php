<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Address;
use App\Models\User;

class ValidAddressSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::take(5)->get();

        foreach ($users as $user) {
            // Address in Jakarta Barat (Valid RajaOngkir ID: 151)
            Address::create([
                'user_id' => $user->id,
                'label' => 'Kantor Jakarta',
                'receiver_name' => $user->name,
                'phone_number' => '08123456789',
                'province_id' => 6,
                'province_name' => 'DKI Jakarta',
                'city_id' => 151,
                'city_name' => 'Jakarta Barat',
                'full_address' => 'Jl. Letjen S. Parman No. 28, Tanjung Duren',
                'postal_code' => '11470',
                'is_default' => true,
            ]);

            // Address in Bandung (Valid RajaOngkir ID: 23)
            Address::create([
                'user_id' => $user->id,
                'label' => 'Rumah Bandung',
                'receiver_name' => $user->name,
                'phone_number' => '08123456789',
                'province_id' => 9,
                'province_name' => 'Jawa Barat',
                'city_id' => 23,
                'city_name' => 'Bandung',
                'full_address' => 'Jl. Asia Afrika No. 65',
                'postal_code' => '40111',
                'is_default' => false,
            ]);
        }
    }
}
