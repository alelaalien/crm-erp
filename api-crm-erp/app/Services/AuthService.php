<?php 

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Models\User;

class AuthService {

    public function register(array $data)
    {
       return User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }
    public function attemptToLogin(array $data)
    {
        $token = auth('api')->attempt($data);

        if($token) 
            return  $this->formatResponse($token);

        else return null;
    }

 
public function refresh()
{
 
    $token = auth('api')->refresh();

    return $this->formatResponse($token);

  
   
}

    private function formatResponse($token)
    {
         return [
        'access_token' => $token,
        'token_type'   => 'bearer',
        'expires_in'   => auth('api')->factory()->getTTL() * 60,
        'user'         => new UserResource(auth('api')->user()->load(['branch', 'roles.permissions']))
          ];
    }
     
}

 