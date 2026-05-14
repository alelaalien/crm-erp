<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserAccessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            //code...
  
        $search = $request->get("search");
        $users = User::with(['roles', 'branch'])
        ->where(function($query) use ($search) {
            $query->where("name", "like", "%".$search."%")
                    ->orWhere("last_name", "like", "%".$search."%")
                    ->orWhere("email", "like", "%".$search."%")
                    ->doc_number("last_name", "like", "%".$search."%")
                    ->orWhere("phone", "like", "%".$search."%");



        })
                ->orderBy("id","desc")
                ->paginate(25);



                return response()->json([
                    "status"=>"success",
                    "total" => $users->total(),
                    "users" => $users->map(function($user){
                        return[
                            'name' =>$user->name,
                            'email' =>$user->email,
                            'id' =>$user->id, 
                            'last_name' =>$user->last_name,
                            'avatar' =>$user->avatar? env("APP_URL")."/storage" .$user->avatar:null,
                            'phone' =>$user->phone,
                            'doc_type' =>$user->doc_type,
                            'doc_number' =>$user->doc_number,
                            'branch_id' =>$user->branch_id,
                            'address' =>$user->address  ,
                            'roles' =>$user->roles->map(function($role){

                                   return [
                                        "id" => $role->id,
                                        "name" => $role->name,
                                   ];

                                }),
                            'branches' =>$user->branches->map(function($branch){
                                
                            return [
                                "id" => $branch->id,
                                "name" => $branch->name,
                                "address" => $branch->address,

                            ];
                            }),
                        ];
                    }),
                
                ], 200);

        } catch (Exception $e) {
            
        return response()->json([
            "status"=>"error",
            "message" => $e->getMessage()
        ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
                    "name"        => 'required|string|max:250',
                    "last_name"   => 'required|string|max:250',
                    "doc_number"  => 'required|string|unique:users,doc_number',
                    "email"       => 'required|email|unique:users,email',
                    "password"    => 'required|min:8', 
                    "branch_id"   => 'nullable|exists:branches,id',
                    'avatar'      => 'nullable|string|max:35',
                    'phone'       => 'nullable|string|max:35',
                    'doc_type'    => 'required|string|max:35', 

//                    'rol_id'      => 'nullable|exists:roles,id',
                    'address'     => 'nullable|string|max:250',


            ]);
            
            
       try {
            
            $user = DB::transaction(function() use($request){
            $userData = $request->except('password');

            $userData['password'] = bcrypt($request->password);

                $newUser = User::create($userData);

                if($request->roles){
                    
                    $newUser->syncRoles($request->roles);
                }
        

                if($request->hasFile("image")){
                    $path = Storage::putFile(
                        "users", $request->file("image")
                    );

                    $request->request->add(["avatar" => $path]);
                }

                return $newUser;
            });

            

            return response()->json([
                "status" => "success",
                "message" =>"User created.",
                "user" => $user
            ], 201);


        } catch (\Exception $e) {
            return response()->json([ 
                "status" => "error",
                "message" =>"Something went wrong while user creating.",
                "error" => $e->getMessage()

            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $request->validate([
                    "name"        => 'required|string|max:250',
                    "last_name"   => 'required|string|max:250',
                    "doc_number"  => 'required|string|unique:users,doc_number',
                    "email"       => 'required|email|unique:users,email',
                    "password"    => 'required|min:8', 
                    "branch_id"   => 'nullable|exists:branches,id',
                    'avatar'      => 'nullable|string|max:35',
                    'phone'       => 'nullable|string|max:35',
                    'doc_type'    => 'required|string|max:35', 

//                    'rol_id'      => 'nullable|exists:roles,id',
                    'address'     => 'nullable|string|max:250',


            ]);
            
            
       try {
            
            $user = DB::transaction(function() use($request, $id){
            
            $userData = $request->except(['password', 'image']);

            if($request->password) $userData['password'] = bcrypt($request->password);
 
            $currentUser = User::findOrFail($id); 

            if($request->roles){
                
                $currentUser->syncRoles($request->roles);
            }
         
            if($request->hasFile("image")){
                
                if($currentUser->avatar) Storage::delete($currentUser->avatar);
                
                $path = Storage::putFile(
                    "users", $request->file("image")
                );

                $userData["avatar"] = $path ;
                }


                $currentUser->update($userData);

                return $currentUser;
            });

            

            return response()->json([
                "status" => "success",
                "message" =>"User created.",
                "user" => $user
            ], 200);


        } catch (\Exception $e) {
            return response()->json([ 
                "status" => "error",
                "message" =>"Something went wrong while user editing.",
                "error" => $e->getMessage()

            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
       $user = User::findOrFail($id);
       try {
        if($user->avatar) Storage::delete($user->avatar);

        $user->delete();

        return response()->json([
            "status" => "success",
            "message" => "User deleted.",
            "user_id"=> $id 
        ], 200);

       } catch (\Exception $e) {
                 return response()->json([
            "status" => "error",
            "message" => "Something went wrong when deleting user #". $id .".", 
        ], 500);
       }
       
    }
}
