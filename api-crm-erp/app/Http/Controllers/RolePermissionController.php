<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
public function index(Request $request)
{

    try {
            $search = $request->get("search");

            $roles = Role::where("name", "like", "%".$search."%")
                ->orderBy("id", "desc")
                ->paginate(25);

            return response()->json([
                "status" => "success",
                "total" => $roles->total(),
                "roles" => $roles->map(function($rol){
                    
                    $rol->permission_pluck = $rol->permissions->pluck("name");
                    $rol->updated_format_at = $rol->updated_at ? $rol->updated_at->format("d-m-Y h:i A") : null;

                    return $rol; 
                })      
                ], 200);  
    } catch (\Exception $e) {
        return response()->json([
                "status" => "error",
                "message" => "Something went wrong.",
                "debug" => $e->getMessage()  
            ], 500);
    }
    
   
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    try {
        $request->validate([
                'name'=>'required|unique:roles,name',
                'permissions' => 'required|array'
        ]);

        $role = DB::transaction(function() use($request){

            $newRole = Role::create([
                'guard_name' => 'api',
                'name' => $request->name
            ]);

            $newRole->syncPermissions($request->permissions);

            return $newRole;
       });

       return response()->json([

        'status'=>'success',
        "message" => "Role created",
        "role"=>[
                    "id" => $role->id,
                    "permission" => $role->permissions,
                    "permission_pluck"  => $role->permissions->pluck("name"),
                    "updated_at" => $role->updated_at ? $role->updated_at->format('d-m-Y h:i A') : null,
                    "name" => $role->name
                ]
            
       ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
         
        return response()->json([
            "status"=> "error",
            "message" => "invalid data",
            "errors" => $e->errors()
        ], 422);
    
    } catch(\Exception $e){

        return response()->json([
            "status" => "error",
          //  "debug" => $e->getMessage(),
            "message" => "Something went wrong while role creating",
            "line" => $e->getLine(),
            "file" => $e->getFile()
        ], 500);
    }
 
         
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
