<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" =>$this->id,
            "name" => $this->name,
            "address" => $this->address,
            "longitude" => $this->longitude,
            "latitude" => $this->latitude,
            "last_updated" => $this->updated_at->format("d-m-y h:i A"),
            "phone" => $this->phones?->map(
                function($p)
                {
                    return ["number" => $p->phone_number, "type" =>$p->type];

                }
            ),
            "images" => $this->images?->map(
                function($i)
                {
                    return ["url" => $i->url ? asset("storage/branches/". $i->url) 
                                 : asset("/storage/branches/branch.png"), 
                    "is_main" => $i->is_main];
                }
            )

        ];
    }
}
