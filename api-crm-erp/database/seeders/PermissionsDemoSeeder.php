<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsDemoSeeder extends Seeder
{
    /**
     * Create the initial roles and permissions.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        Permission::create(['guard_name' => 'api','name' => 'register_role']);
        Permission::create(['guard_name' => 'api','name' => 'edit_role']);
        Permission::create(['guard_name' => 'api','name' => 'delete_role']);
        Permission::create(['guard_name' => 'api','name' => 'register_user']);

        Permission::create(['guard_name' => 'api','name' => 'edit_user']);
        Permission::create(['guard_name' => 'api','name' => 'delete_user']);
        Permission::create(['guard_name' => 'api','name' => 'register_product']);
        Permission::create(['guard_name' => 'api','name' => 'edit_product']);

        Permission::create(['guard_name' => 'api','name' => 'delete_product']);
        Permission::create(['guard_name' => 'api','name' => 'show_wallet_price_product']);
        Permission::create(['guard_name' => 'api','name' => 'register_wallet_price_product']);
        Permission::create(['guard_name' => 'api','name' => 'edit_wallet_price_product']);

        Permission::create(['guard_name' => 'api','name' => 'delete_wallet_price_product']);
        Permission::create(['guard_name' => 'api','name' => 'register_clients']);
        Permission::create(['guard_name' => 'api','name' => 'edit_clients']);
        Permission::create(['guard_name' => 'api','name' => 'delete_clients']); 

        Permission::create(['guard_name' => 'api','name' => 'validate_payments']);
        Permission::create(['guard_name' => 'api','name' => 'cash_reports']);
        Permission::create(['guard_name' => 'api','name' => 'record_contract_process']);
        Permission::create(['guard_name' => 'api','name' => 'cash_outflow']);

        Permission::create(['guard_name' => 'api','name' => 'cash_inflow']);
        Permission::create(['guard_name' => 'api','name' => 'close_cash_register']);
        Permission::create(['guard_name' => 'api','name' => 'register_proforma']);
        Permission::create(['guard_name' => 'api','name' => 'edit_proforma']);

        Permission::create(['guard_name' => 'api','name' => 'delete_proforma']);
        Permission::create(['guard_name' => 'api','name' => 'schedule']);
        Permission::create(['guard_name' => 'api','name' => 'commissions']);
        Permission::create(['guard_name' => 'api','name' => 'register_purchase']);

        Permission::create(['guard_name' => 'api','name' => 'edit_purchase']);
        Permission::create(['guard_name' => 'api','name' => 'delete_purchase']);
        Permission::create(['guard_name' => 'api','name' => 'register_transport']);
        Permission::create(['guard_name' => 'api','name' => 'edit_transport']);

        Permission::create(['guard_name' => 'api','name' => 'delete_transport']);
        Permission::create(['guard_name' => 'api','name' => 'dispatch']);
        Permission::create(['guard_name' => 'api','name' => 'movements']);
        Permission::create(['guard_name' => 'api','name' => 'inventory_kardex']);

        // Create roles and assign existing permissions
        // $role1 = Role::create(['guard_name' => 'api','name' => 'writer']);
        // $role1->givePermissionTo('edit articles');
        // $role1->givePermissionTo('delete articles');

        // $role2 = Role::create(['guard_name' => 'api','name' => 'admin']);
        // $role2->givePermissionTo('publish articles');
        // $role2->givePermissionTo('unpublish articles');

        // $role3 = Role::create(['guard_name' => 'api','name' => 'Super-Admin']);
        // gets all permissions via Gate::before rule; see AuthServiceProvider

        // Create demo users
        // $user = \App\Models\User::factory()->create([
        //     'name' => 'Example User',
        //     'email' => 'test@example.com',
        //     'password' => bcrypt("12345678"),
        // ]);
        // $user->assignRole($role1);

        // $user = \App\Models\User::factory()->create([
        //     'name' => 'Example Admin User',
        //     'email' => 'admin@example.com',
        //     'password' => bcrypt("12345678"),
        // ]);
        // $user->assignRole($role2);

/*         $user = \App\Models\User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt("12345678"),
        ]);
        $user->assignRole($role3); */
    }
}
