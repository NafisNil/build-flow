<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;
use Spatie\Permission\Models\Role;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $company = Company::create([
            'name' => 'Default Company',
            'nhbc_registration_number' => 'NHBC-123456'
        ]);

        Role::create([
            'name' => 'Company Admin'
        ]);
        Role::create([
            'name' => 'Site Manager'
        ]);
        Role::create([
            'name' => 'manager'
        ]);

        $user = User::factory()->create([
            'name' => 'Default User',
            'email' => 'default@example.com',
            'company_id' => $company->id
        ]);

        $user->assignRole('Company Admin');
    }
}
