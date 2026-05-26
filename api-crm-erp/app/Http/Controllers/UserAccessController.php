<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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
        $users = User::with(['roles', 'branch', 'permissions'])
        ->where(function($query) use ($search) {
            $query->where("name", "like", "%".$search."%")
                    ->orWhere("last_name", "like", "%".$search."%")
                    ->orWhere("email", "like", "%".$search."%")
                    ->orWhere("doc_number", "like", "%".$search."%")
                    ->orWhere("phone", "like", "%".$search."%");



        })
                ->orderBy("id","desc")
                ->paginate(25);



            return response()->json([
                "status" => "success",
                "total"  => $users->total(),
                "users"  => $users->map(function($user) {
                    return [
                        'id'          => $user->id, 
                        'name'        => $user->name,
                        'last_name'   => $user->last_name,
                        'email'       => $user->email,
                        'avatar'      => $user->avatar = $user->avatar ,
                                //:  asset("/storage/users/user.png"),
                        'phone'       => $user->phone,
                        'doc_type'    => $user->doc_type,
                        'doc_number'  => $user->doc_number, 
                        'updated_at'  => $user->updated_at ? $user->updated_at->format('d-m-Y h:i A'): null,  
                        'address'     => $user->address,
                     'roles'  => $user->roles?->map(function($role) {
                                        return [
                                            "id"          => $role->id,
                                            "name"        => $role->name,
                                            "permissions" => $role->permissions?->map(function($permission) {
                                              return  ["name" => $permission->name];
                                            })->toArray() ?? [] 
                                           
                                        ];
                                    }),
                            'branch'      => $user->branch ? [
                            "id"      => $user->branch->id,
                            "name"    => $user->branch->name,
                            "address" => $user->branch->address,
                        ] : null,
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
                    'avatar'      => 'nullable',
                    'phone'       => 'nullable|string|max:35',
                    'doc_type'    => 'required|string|max:35',  
                    'gender'      => 'nullable|in:M,F,N',
                    'address'     => 'nullable|string|max:250',


            ]);
            
            
       try {
            
            $user = DB::transaction(function() use($request){
                
            $userData = $request->except(['password', 'avatar']);

            $userData['password'] = bcrypt($request->password);

                if ($request->hasFile("image")) {
                    
                $file = $request->file("image");
    
                $path = $file->store("users", "public"); 
    
                $userData['avatar'] = basename($path); 
   
}
                $newUser = User::create($userData);

                if($request->roles){
                    
                    $roles = json_decode($request->roles, true);
                    $newUser->syncRoles($roles);
                } 
 
                $newUser->refresh();
                $newUser->load(['branch', 'roles.permissions']);
         
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
                    "email"       => 'required|email|unique:users,email, ' .$id,
                    "password"    => 'nullable|min:8', 
                    "branch_id"   => 'nullable|exists:branches,id',
                    'avatar'      => 'nullable',
                    'phone'       => 'nullable|string|max:35',
                    'doc_type'    => 'required|string|max:35',  
                    'gender'      => 'nullable|in:M,F,N',
                    'address'     => 'nullable|string|max:250', 
                    "doc_type"    => 'required|string',
                    "doc_number"  => [
                        'required',
                        'string',
                        Rule::unique("users", "doc_number")
                                    ->ignore($id)
                                    ->where(function($query) use ($request){
                                        return $query->where('doc_type', $request->doc_type);
                                    })
                    ] 
            ]);
             
       try {
            
            $user = DB::transaction(function() use($request, $id){
            
            $userData = $request->except(['password', 'image']);

            if($request->password) $userData['password'] = bcrypt($request->password);
 
            $currentUser = User::findOrFail($id); 

            if($request->roles){

            $ids = json_decode($request->roles, true);
                $rolesIds = array_map('intval',$ids  );
                $currentUser->syncRoles($rolesIds);
            }
         
            if($request->hasFile("image")){
                
                if($currentUser->avatar) Storage::delete($currentUser->avatar);
                 
                $file = $request->file("image");
    
                $path = $file->store("users", "public"); 
    
                $userData['avatar'] = basename($path); 
                }

                
                $currentUser->update($userData);
                $currentUser->refresh();
                $currentUser->load(["branch", "roles.permissions"]);

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
