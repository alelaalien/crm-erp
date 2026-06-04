<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        return [
          
            "name"        => 'required|string|max:250',
            "last_name"   => 'required|string|max:250', 
            "email"       => 'required|email|unique:users,email,'. $userId,
            "password"    => $this->isMethod('post') ? 'required|min:8' : 'nullable|min:8',
            "branch_id"   => 'nullable|exists:branches,id',
            'avatar'      => 'nullable',
            'phone'       => 'nullable|string|max:35',
            'doc_type'    => 'required|string|max:35',  
            'gender'      => 'nullable|in:M,F,N',
            'address'     => 'nullable|string|max:250', 
            'roles'       => 'nullable|string',  
            'image'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            "doc_number"  => [
                                'required',
                                'string',
                                Rule::unique("users", "doc_number")
                                ->ignore($userId)
                                ->where
                                    (
                                        fn($query) =>  $query->where('doc_type', $this->doc_type)
                                    )
                                
                            ]
         ];    
    }
}
