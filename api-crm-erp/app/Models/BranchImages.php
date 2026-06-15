<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BranchImages extends Model
{
    use HasFactory;

   protected $fillable = [
        "url",
        "branch_id",
        "sort_order",
        "alt_text",
        "is_main"
    ];

 
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, "brach_id");
    }
}
