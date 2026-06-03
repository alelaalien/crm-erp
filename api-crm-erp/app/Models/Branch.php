<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'address',
        'phone'
        ];

    
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function phones(): MorphMany
    {
        return $this->morphMany(Phone::class, 'phoneable');
    }
}
