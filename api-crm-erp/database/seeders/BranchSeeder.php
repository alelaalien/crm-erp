<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Branch;
class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $branches = [
            [
                'name' => 'Malaga Tech Park HQ',
                'address' => 'Av. de Galileo Galilei, 23',
                'city' => 'Málaga',
                'country' => 'España',
            ],
            [
                'name' => 'Madrid Innovation Center',
                'address' => 'Paseo de la Castellana, 95',
                'city' => 'Madrid',
                'country' => 'España',
            ],
            [
                'name' => 'CDMX Financial District',
                'address' => 'Paseo de la Reforma, 222',
                'city' => 'CDMX',
                'country' => 'México',
            ],
            [
                'name' => 'Medellin Poblado Office',
                'address' => 'Cra. 43A #1-50',
                'city' => 'Medellín',
                'country' => 'Colombia',
            ],
            [
                'name' => 'Silicon Valley Hub',
                'address' => '1600 Amphitheatre Pkwy',
                'city' => 'San Francisco',
                'country' => 'Estados Unidos',
            ],
        ];

        foreach ($branches as $branchData) {
            
            Branch::updateOrCreate(
                ['name' => $branchData['name']],  
                $branchData                      
            );
            }
    }
}
