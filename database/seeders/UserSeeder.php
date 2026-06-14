<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name'              => 'Admin NadaKita',
                'email'             => 'admin@nadakita.id',
                'password'          => Hash::make('password123'),
                'role'              => 'admin',
                'email_verified_at' => now(),
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'name'              => 'Rina Septiani',
                'email'             => 'rina.septiani@mail.com',
                'password'          => Hash::make('password123'),
                'role'              => 'customer',
                'email_verified_at' => now(),
                'created_at'        => now()->subDays(2),
                'updated_at'        => now()->subDays(2),
            ],
            [
                'name'              => 'Dimas Pratama',
                'email'             => 'dimas.pratama@music.com',
                'password'          => Hash::make('password123'),
                'role'             => 'customer',
                'email_verified_at' => now(),
                'created_at'        => now()->subDays(5),
                'updated_at'        => now()->subDays(5),
            ],
            [
                'name'              => 'Sari Wulandari',
                'email'             => 'sari.wulandari@sekolah.sch.id',
                'password'          => Hash::make('password123'),
                'role'              => 'customer',
                'email_verified_at' => now(),
                'created_at'        => now()->subDays(10),
                'updated_at'        => now()->subDays(10),
            ],
            [
                'name'              => 'Toni Hermawan',
                'email'             => 'toni.vintage@gmail.com',
                'password'          => Hash::make('password123'),
                'role'              => 'customer',
                'email_verified_at' => now(),
                'created_at'        => now()->subDays(15),
                'updated_at'        => now()->subDays(15),
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }

        $userIds = User::whereIn('email', array_column($users, 'email'))
            ->pluck('id', 'email');

        // Customer profiles
        $profiles = [
            ['email' => 'admin@nadakita.id', 'phone' => '081234567890', 'address' => 'Jl. Melawai Raya No. 88, Kebayoran Baru', 'city' => 'Jakarta Selatan', 'province' => 'DKI Jakarta', 'postal_code' => '12160', 'created_at' => now(), 'updated_at' => now()],
            ['email' => 'rina.septiani@mail.com', 'phone' => '085712345678', 'address' => 'Perum Permata Bintaro Blok C-15', 'city' => 'Tangerang Selatan', 'province' => 'Banten', 'postal_code' => '15322', 'created_at' => now()->subDays(2), 'updated_at' => now()->subDays(2)],
            ['email' => 'dimas.pratama@music.com', 'phone' => '081987654321', 'address' => 'Jl. Setiabudi No. 45, Hegarmanah', 'city' => 'Bandung', 'province' => 'Jawa Barat', 'postal_code' => '40162', 'created_at' => now()->subDays(5), 'updated_at' => now()->subDays(5)],
            ['email' => 'sari.wulandari@sekolah.sch.id', 'phone' => '081234123456', 'address' => 'Jl. Pattimura No. 12, Ambon', 'city' => 'Ambon', 'province' => 'Maluku', 'postal_code' => '97111', 'created_at' => now()->subDays(10), 'updated_at' => now()->subDays(10)],
            ['email' => 'toni.vintage@gmail.com', 'phone' => '085600900123', 'address' => 'Jl. Diponegoro No. 77, Cicendo', 'city' => 'Bandung', 'province' => 'Jawa Barat', 'postal_code' => '40116', 'created_at' => now()->subDays(15), 'updated_at' => now()->subDays(15)],
        ];

        foreach ($profiles as $profile) {
            $email = $profile['email'];
            unset($profile['email']);

            DB::table('customer_profiles')->updateOrInsert(
                ['user_id' => $userIds[$email]],
                $profile + ['user_id' => $userIds[$email]]
            );
        }
    }
}
