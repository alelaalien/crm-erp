<?php

namespace App\Services;

use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleService {

    public function createRole(array $data)
    {
        return DB::transaction(
            function() use($data)
            {
                $role = Role::create(
                    [
                        'name' => $data['name'],
                        'guard_name'=> 'api'
                    ]
                );

                $role->syncPermissions(
                    [
                        $data['permissions']
                    ]
                );

                return $role;
            }
        );
    }

    public function updateRole(Role $role, array $data)
    {
        return DB::transaction(
            function() use ($role, $data)
            {
                $role->update([ 'name' => $data['name']]);
                $role->syncPermissions($data['permissions']);
                return $role;
            }
        );
    }

    public function deleteRole(Role $role)
    {
        if(in_array($role->name, ['Admin', 'Super Admin']))

            throw new \Exception("System roles cannot be deleted.", 403);

        DB::transaction(
            function() use ($role)
            {
                $role->syncPermissions([]);
                $role->delete();
            }
        );
    
    }

    public function getAll(string $search) 
    {
        
        $roles = Role::where("name", "like", "%".$search."%")
                    ->orderBy("name", "desc")
                    ->paginate(25);
        return $roles;
    }

}


