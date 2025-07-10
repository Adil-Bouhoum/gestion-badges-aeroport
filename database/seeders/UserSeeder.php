<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{


    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Airport Admin',
            'email' => 'admin@aeroport.com',
            'password' => Hash::make('password123'), // Manual hashing
            'fonction' => 'Security Manager',
            'service' => 'Operations'
        ]);
    }
}
