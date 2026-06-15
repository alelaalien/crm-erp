<?php

namespace App\Http\Controllers;

use App\Http\Requests\BranchRequest;
use App\Http\Resources\BranchResource; 
use App\Models\Branch;
use App\Services\BranchService; 
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    private BranchService $service ;

    public  function __construct(BranchService $service) {

        $this->service = $service;
    }
    public function index(Request $request)
    {

            $search = $request->query('search');
            $data = $this->service->getAll($search); 
            return response()->json(
                [
                    "status" => "success",
                    "total" => $data->total(),
                    "branches" =>  BranchResource::collection($data)
                ], 200
            );
 
    }

    /**
     * Store a newly created resource in storage.
     */
  public function store(BranchRequest $request)
{
    
    $validatedData = $request->validated();
    
    
    $files = $request->file('images');
    $phones = $request->input('phones');
    // dd($request->all(), $request->input('phones')); 
    $isMain = $request->input('isMain');

 
    $branch = $this->service->create($validatedData, $files, $isMain, $phones);

    return response()->json([
        "status" => "success",
        "branch" => new BranchResource($branch) 
    ], 201);
 
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
         $response = $this->service->delete($branch);
        return response()->json([
            "state" =>"success",
            "brach" => new BranchResource($response)
        ], 200);
    }
}
