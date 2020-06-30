<?php

namespace App\Http\Controllers\API;

use App\Hospital;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HospitalsController extends Controller
{
    public function __construct()
    {
        return $this->middleware('auth:api');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Hospital::latest()->paginate(10);
    }

    public function search()
    {
        if ($search = \Request::get('q')) {
            $hospital = Hospital::where(function ($query) use ($search) {
                $query->where('name', 'LIKE', "%$search%");
            })->paginate(20);
        } else {
            $hospital = Hospital::latest()->paginate(5);
        }

        return $company;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255|unique:hospitals,name,NULL,id,deleted_at,NULL'
        ]);
        Hospital::create($request->all());
        return response()->json(['message' => 'success']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $hospital = Hospital::findOrFail($id);
        $this->validate($request, [
            'name' => 'required|string|max:255|unique:hospitals,name,' . $hospital->id . ',id,deleted_at,NULL'
        ]);
        $hospital->update($request->all());
        return response()->json(['message' => 'updated']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $hospital = Hospital::findOrFail($id);
        $hospital->details()->delete();
        $hospital->delete();
        return response()->json(['message' => 'deleted']);
    }
}
