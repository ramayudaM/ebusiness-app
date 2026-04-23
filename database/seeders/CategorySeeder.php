<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            ['id' => 1, 'parent_id' => null, 'name' => 'Gitar', 'slug' => 'gitar', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'parent_id' => null, 'name' => 'Bass', 'slug' => 'bass', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'parent_id' => null, 'name' => 'Drum & Perkusi', 'slug' => 'drum-perkusi', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'parent_id' => null, 'name' => 'Keyboard & Piano', 'slug' => 'keyboard-piano', 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'parent_id' => null, 'name' => 'Amplifier', 'slug' => 'amplifier', 'sort_order' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'parent_id' => null, 'name' => 'Aksesoris', 'slug' => 'aksesoris', 'sort_order' => 6, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'parent_id' => null, 'name' => 'Suku Cadang', 'slug' => 'suku-cadang', 'sort_order' => 7, 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('categories')->insert([
            ['id' => 8, 'parent_id' => 1, 'name' => 'Gitar Akustik', 'slug' => 'gitar-akustik', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'parent_id' => 1, 'name' => 'Gitar Elektrik', 'slug' => 'gitar-elektrik', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 10, 'parent_id' => 1, 'name' => 'Gitar Klasik', 'slug' => 'gitar-klasik', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'parent_id' => 1, 'name' => 'Ukulele', 'slug' => 'ukulele', 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 12, 'parent_id' => 2, 'name' => 'Bass Elektrik', 'slug' => 'bass-elektrik', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'parent_id' => 2, 'name' => 'Bass Akustik', 'slug' => 'bass-akustik', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 14, 'parent_id' => 3, 'name' => 'Drum Akustik', 'slug' => 'drum-akustik', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 15, 'parent_id' => 3, 'name' => 'Drum Elektronik', 'slug' => 'drum-elektronik', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 16, 'parent_id' => 3, 'name' => 'Cymbal', 'slug' => 'cymbal', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 17, 'parent_id' => 3, 'name' => 'Snare Drum', 'slug' => 'snare-drum', 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 20, 'parent_id' => 6, 'name' => 'Senar', 'slug' => 'senar', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 21, 'parent_id' => 6, 'name' => 'Pick', 'slug' => 'pick', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 22, 'parent_id' => 6, 'name' => 'Tuner', 'slug' => 'tuner', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);
        
        // Resetting sequence for postgres
        DB::statement("SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))");
    }
}
