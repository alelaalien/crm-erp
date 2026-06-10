<?php

namespace App\Http\Controllers;

use App\Http\Requests\BranchRequest;
use App\Http\Resources\BranchResource; 
use App\Models\Branch;
use App\Services\BranchService;
use Exception;
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

        $item = $this->$request->validate();

        $reponse = $this->service->create($item); 
       
          return response()->json([
                "status" => "success",
                "message" =>"Branch created.",
                "branch" => new BranchResource($reponse)
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
        //
    }
}
