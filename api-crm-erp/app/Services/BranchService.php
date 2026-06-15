<?php 

namespace App\Services;

use App\Models\Branch;
class BranchService {

    public function create(array $data, ?array $files, ?array $isMain, ?string $phones)
    {
       
        $branch = Branch::create($data);

       
        if ($files) {
            foreach ($files as $index => $file) {
                $path = $file->store("branches", "public");
                $branch->images()->create([
                    "url" => basename($path),
                    "is_main" => ($isMain[$index] ?? 'false') === 'true'
                ]);
            }
        }

    
        if ($phones) {
            $phoneData = is_string($phones) ? json_decode($phones, true) : $phones;
            foreach ($phoneData as $p) {

                $branch->phones()->create([
                    "phone_number"=> $p["number"],
                    "type"=>$p["type"]
                ]);
            }
        }

    return   $branch->load(['images', 'phones']);
     
    }

    public function getAll(?string $search) 
    {
       return Branch::with(['images', 'phones'])
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

    public function delete(Branch $data )
    {
        $data->delete();
        return $data;
    }
}