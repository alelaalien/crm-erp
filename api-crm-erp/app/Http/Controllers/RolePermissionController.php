<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\RoleService; 
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role; 

class RolePermissionController extends Controller
{
 
    protected $service;
   
    public function __construct(RoleService $service)
    {   
        $this->service = $service;
    }
    
    public function index(Request $request)
    { 
        $roles = $this->service->getAll($request->query('search')); 
        
         return response()->json([
                    "status" => "success",
                    "total" => $roles->total(),
                    "roles" => RoleResource::collection($roles)       
                    ], 201);   
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
  
        $role = $this->service->createRole($request->validated());

        return response()->json(
            [
                "status" =>'success',
                'message' => 'Role created',
                'role' => new RoleResource($role)
            ],201
        ); 
    }
  
    public function update(RoleRequest $request, Role $role)
    { 
            $role = $this->service->updateRole($role, $request->validated());
 
            return response()->json([
                "status" => "success",
                "message" => "Role edited",
                "role"=> new RoleResource($role)

            ], 200); 
    }
 
    public function destroy(Role $role)
    {

        $this->service->deleteRole($role);
  
        return response()->json([
            "status" => "success",
            "id" =>$role->id,
            "message" => "Role deleted successfully"
        ], 200);
        
       
    }
}
