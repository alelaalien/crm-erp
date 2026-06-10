<?php 

namespace App\Services;

use App\Models\Branch;
use Illuminate\Support\Facades\DB;

class BranchService {

    public function create(array $data)
    {
        return DB::transaction(
            function() use($data)
            {
                $branch = Branch::create(
                    [
                        "name" => $data["name"],
                        "lon" => $data["lon"],
                        "lat" => $data["lat"],
                        "address" => $data["address"],  
                    ]
                );
                    if($data['phones']) 
                        $branch->phone()->createMany($data['phones']);

                    return $branch;
            } 
        );
    }
    public function getAll(?string $search) 
    {
       return Branch::with('phones')
                ->when($search, function($query) use ($search)
                {
                     $query->where(function($q) use($search)
                     {
                        $q->where("name", "like", "%{$search}%")
                                 ->orWhere("address", "like", "%{$search}%");
                     });
                })
                ->orderBy("name", "asc")->paginate(25);
         
    }
}