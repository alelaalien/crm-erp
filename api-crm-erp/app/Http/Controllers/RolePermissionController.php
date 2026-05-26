<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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
                ], 201);  
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
            
       ], 200);
    } catch (\Illuminate\Validation\ValidationException $e) {
         
        return response()->json([
            "status"=> "error",
            "message" => "invalid data",
            "errors" => $e->errors()
        ], 422);
    
    } catch(\Exception $e){

        return response()->json([
            "status" => "error",
           "debug" => $e->getMessage(),
            "message" => "Something went wrong while role creating",
            "line" => $e->getLine(),
            "file" => $e->getFile()
        ], 500);
    }
 
         
    }
    public function update(Request $request, string $id)
    {

    try {
        $request->validate([
            "name" => "required|unique:roles,name,". $id,
            "permissions" => "required|array|min:1"
        ]);
            $role= Role::findOrFail($id);
            $role->update($request->only("name"));

            $role->syncPermissions($request->permissions);

            return response()->json([
                "status" => "success",
                "message" => "Role edited",
                "role"=>[
                            "id" => $role->id,
                            "permission" => $role->permissions,
                            "permission_pluck"  => $role->permissions->pluck("name"),
                            "updated_at" => $role->updated_at ? $role->updated_at->format('d-m-Y h:i A') : null,
                            "name" => $role->name
                        ]

            ], 200);
    }catch (\Illuminate\Validation\ValidationException $e) {
         
        return response()->json([
            "status"=> "error",
            "message" => "invalid data",
            "errors" => $e->errors()
        ], 422);
    
    } catch(\Exception $e){

        return response()->json([
            "status" => "error",
            "debug" => $e->getMessage(),
            "message" => "Something went wrong while role editing",
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


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            
         $role = Role::findOrFail($id);
         if(in_array($role->name, ['Admin', 'Super-Admin'] ))
            {
                return response()->json([
                    "status" => "error",
                    "message" => "System roles cannot be deleted."
                ], 403);
            }

            $role->syncPermissions([]);
            $role->delete();

            return response()->json([
                "status" => "success",
                "id" =>$id,
                "message" => "Role deleted successfully"
            ], 200);
        
        } catch (ModelNotFoundException $e) {
             
            return response()-> json([
                "status" => "error",
                "message" => "Role not found."
            ], 404);
        }catch(Exception $e){

            return response()->json([
                "status" => "error",
                "message" => "Something went wrong while deleting.",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
