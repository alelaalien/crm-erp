<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use App\Models\Branch;
use Exception;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        try {
                
        $branches = Branch::with('phones');

                if ($request->filled('search')) {
                    $search = $request->search;
                    $branches->where(function($query) use ($search) {
                        $query->where("name", 'like', "%{$search}%")
                            ->orWhere("address", 'like', "%{$search}%");
                    });
                }

                $branches = $branches->orderBy("name", "desc")->paginate(25);

        return response()->json(
            [
                "status" => "success",
                "total" => $branches->total(),
                "branches" => $branches
            ], 200
        );



        } catch (Exception $e) {
           return response()->json([ "status"=>"error",
            "message" => $e->getMessage()]);
        } 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
            "name" => 'required|string|max:250',
            "address" =>'required|string|max:250'
         ]);

         try {
  /*           $branch = DB::transaction(
                    function() use($request)
                    {
                        if($request->hasFile("image"))
                            {
                                $file = $request->file('image');
                                $path = $file->store("branches", "public");
                               // $brachImage['image'] = basename($path);
                            }

                            $newBrach = Branch::create($b)
                    } */
           // );
           // $userData = $request->except(['password', 'avatar']);
           $branch = Branch::create($request->all());
          return response()->json([
                "status" => "success",
                "message" =>"Branch created.",
                "branch" => $branch
            ], 201);

         } catch (Exception $e) {
           return response()->json([ 
                "status" => "error",
                "message" =>"Something went wrong while user creating.",
                "error" => $e->getMessage()

            ]);
         }
    }

    /**
     * Display the specified resource.
     */
    public function show(Branch $branch)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Branch $branch)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branch $branch)
    {
        //
    }
}
