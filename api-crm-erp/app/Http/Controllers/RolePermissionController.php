<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
public function index(Request $request)
{
    $search = $request->get("search");

    $roles = Role::where("name", "like", "%".$search."%")
        ->orderBy("id", "desc")
        ->paginate(25);

    return response()->json([
        "total" => $roles->total(),
        "roles" => $roles->map(function($rol){
            
             $rol->permission_pluck = $rol->permissions->pluck("name");
             $rol->updated_format_at = $rol->updated_format_at->format("d-m-Y h:i A");

             return $rol;
        })
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $isRole = Role::where("name", $request->name)->first();
        
        if($isRole)
            {
                return response()->json(
                    [
                        "code" => 403,
                        "message" => "Item already exists"
                    ]
                );
            }

            $role= Role::create([

                'guard_name' => 'api',
                'name' => $request->name
            ]);
            
            $role->syncPermissions($request->permissions);
            /*          foreach ($request->permissions as $key => $permission) {
                $role-> givePermissionTo($permission);
            }
            */

            return response()->json([

                "code"=> 200,
                "message"=>[
                     "id" => $role->id,
                     "permission" => $role->permissions,
                     "permission_pluck"  => $role->permissions->pluck("name"),
                     "updated_at" => $role->updated_format_at->format('d-m-Y h:i A'),
                     "name" => $role->name
                     ]
            ]); 
         
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
       $roles = Role::all()
        ->orderBy("id", "desc")
        ->paginate(25);

    return response()->json([
        "total" => $roles->total(),
        "roles" => $roles->getCollection()->transform(function ($rol) {

            $rol->permission_pluck = $rol->permissions
                ->pluck("name")
                ->map(fn($permission)
                
                => ucwords(str_replace("_", " ", $permission))
                );

            return $rol;
        })
    ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $isRole = Role::where("name", $request->name)->where("id", "<>", $id)->first();
        
        if($isRole)
            {
                return response()->json(
                    [
                        "code" => 403,
                        "message" => "Item already exists"
                    ]
                );
            }

            $role= Role::findOrFail($id);
            $role->update($request->all());
            


            foreach ($request->permissions as $key => $permission) {
                $role-> givePermissionTo($permission);
            }

            return response()->json([

                "code"=> 200,
                "message"=>[
                     "id" => $role->id,
                     "permission" => $role->permissions,
                     "permission_pluck"  => $role->permissions->pluck("name"),
                     "updated_at" => $role->updated_format_at->format('d-m-Y h:i A'),
                     "name" => $role->name
                     ]
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
