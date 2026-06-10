<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request; 
use App\Services\UserService;  

class UserAccessController extends Controller
{ 
    private $service;

    public function __construct(UserService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
      
        $users = $this->service->getAll($request->query('search'));

        return response()->json([
            "status" => "success",
            "total"  => $users->total(),
            "users"  => UserResource::collection($users),  
        ], 200);  
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        
            $user = $this->service->createUser($request->validated());
             
            return response()->json([
                "status" => "success",
                "message" =>"User created.",
                "user" => new UserResource($user)
            ], 201);
 
    }

   
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {

        $user = $this->service->updateUser($request->validated(), $user);
            
        return response()->json([
                "status" => "success",
                "message" =>"User updated.",
                "user" => new UserResource($user)
            ], 200); 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    { 
        $this->service->deleteUser($user);
        
        return response()->json([
            "status" => "success",
            "message" => "User deleted.",
            "user_id"=> $user->id 
        ], 200); 
    }
}
