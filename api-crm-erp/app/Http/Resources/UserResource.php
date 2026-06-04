<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
 
            "name"        => $this-> name,  
            "last_name"   => $this-> last_name,  
            "doc_number"  => $this-> doc_number,  
            "email"       => $this-> email,  
            "branch"       => $this-> branch ? [
                                        "name"      => $this->branch->name,
                                        "address"   => $this->branch->address, 
                                        "id"        => $this->branch->id, 
                                        "lon"       => $this->branch->lon, 
                                        "lat"       => $this->branch->lat, 
                                        "status"    => $this->branch->status 

                                    ]: null,
            "avatar"      => $this-> avatar
                                 ? asset("storage/users/". $this->avatar)
                                 : asset("/storage/users/user.png"),
            "phone"       => $this-> phone,  
            "doc_type"    => $this-> doc_type,   
            "gender"      => $this-> gender,  
            "address"     => $this-> address,  
            "id"          => $this-> id,
            "updated_at"  => $this->updated_at?->format("d-m-Y h:i A")
                                              ?? $this->created_at->format("d-m-Y h:i A"),  
            
            
            "roles"       => $this->roles?->map(
                function($role) 
                {
                        return [
                            "id"          => $role->id,
                            "name"        => $role->name,
                            "permissions" => $role->permissions?->map(
                                function($permission) 
                                {
                                    return  ["name" => $permission->name];
                                })->toArray() ?? [] 
                            
                        ];
                })->toArray() ?? [],

        ];
    }
}
                 
                         
 