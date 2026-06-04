<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserService {

    public function createUser( array $data) : User
    {
            return DB::transaction(
                function() use ($data)
                {
                     
                    $userData = $data;    
                    $userData ['password'] = bcrypt($data['password']);

                    if(isset($data['image']))
                        {
                            $file_ = $data['image'];

                            $path = $file_->store("users", "public");

                            $userData["avatar"] = basename($path);

                            unset($userData['image']);

                        }

                    $roles = $data['roles' ] ? json_decode($data['roles'], true) :  [];

                    unset($userData['roles']);

                    $newUser = User::create($userData); 

                    if(!empty($roles))   $newUser->syncRoles($roles);
                  
                    $newUser->refresh();

                    return $newUser->load(['branch', 'roles.permissions']);

                    }
            );
    }

    public function getAll(?string $search)
    {
        $users = User::with([ 'branch', 'roles.permissions']);
 
        if(!empty($search))
            {
                $users->where(function($query) use ($search) {
                    $query->where("name", "like", "{%$search%}")
                    ->orWhere("last_name", "like", "{%$search%}")
                    ->orWhere("email", "like", "{%$search%}")
                    ->orWhere("doc_number", "like", "{%$search%}")
                    ->orWhere("phone", "like", "{%$search%}"); 
                    });
            }
        
        
            return $users->orderBy("last_name","asc")->paginate(25);
    }

    public function updateUser(array $data, User $user) : User
    {
        return DB::transaction
        (
            function() use ($data, $user){

                if(isset($data['image']))
                    { 
                        if($user->avatar) Storage::disk('public')->delete("users/" . $user->avatar);
                       
                        $path =$data['image']->store("users", "public");

                        $data['avatar'] = basename($path);

                        unset($data['image']);
                    }
                if(!empty($data['password'])) 
                    $data['password'] = bcrypt($data['password']);
                else
                    unset($data['password']);

                 $roles = $data['roles' ] ? json_decode($data['roles'], true) :  [];

                 unset($data['roles']);

                 $user->syncRoles($roles);

                 $user->update($data);
                 $user->load(['branch', 'roles.permissions']);

                return $user;

            }
        );
    }

    public function deleteUser(User $user)
    { 
       
        if($user->avatar)   Storage::disk('public')->delete('users/' . $user->avatar);

        return $user->delete();
    }
}