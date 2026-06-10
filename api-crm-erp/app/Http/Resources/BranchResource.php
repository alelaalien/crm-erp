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
            "name" => $this->name,
            "address" => $this->address,
            "lon" => $this->lon,
            "lat" => $this->lat,
            "phone" => $this->phones?->map(
                function($p)
                {
                    return ["number" => $p->phone_numer, "type" =>$p->type];

                }
            ),

        ];
    }
}
