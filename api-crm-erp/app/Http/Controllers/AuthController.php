<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource; 
use App\Services\AuthService; 
 
 
class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    private $service; 

    public function __construct(AuthService $service)
    {
         $this->middleware('auth:api', ['except' => ['login', 'register']]);
         $this->service = $service;
    }
 
 
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request ) {
        
        $toRegister = $this->service->register($request->validated());
   
        return  new UserResource($toRegister) ;
        
    }
 
 
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
public function login(LoginRequest $request)
{
    $payload =  $this->service->attemptToLogin($request->validated());

    return response()->json([
        "access_token" =>$payload['access_token'],
        "token_type"   =>$payload['token_type'],
        "expires_in"   =>$payload['expires_in'],
        "user"         =>$payload['user' ]
    ]); 

/*          if (config('app.env') === 'local') {
            $response['debug'] = [
                'error_message' => $e->getMessage()],
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]; */
        } 
 
 
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = new UserResource(auth('api')->user());
        return response()->json($user);
    }
 
    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();
 
        return response()->json(['message' => 'Successfully logged out']);
    }
 
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }
 
    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    
}