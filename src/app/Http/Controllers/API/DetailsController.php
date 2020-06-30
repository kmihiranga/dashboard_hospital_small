<?php

namespace App\Http\Controllers\API;

use App\Company;
use App\Detail;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Detail::with('companies', 'hospitals')->latest()->paginate(20);
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
            'company' => 'required|numeric',
            'hospital' => 'required|numeric',
            'voucher_no' => 'required|string|max:255',
            'date' => 'required',
            'sub_total' => 'required',
            'payee' => 'required'
        ]);
        Detail::create($request->all());
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
        $details = Detail::findOrFail($id);
        $this->validate($request, [
            'company' => 'required|numeric',
            'hospital' => 'required|numeric',
            'voucher_no' => 'required|string|max:255',
            'date' => 'required',
            'sub_total' => 'required',
            'payee' => 'required',
            'month' => 'required'
        ]);
        $details->update($request->all());
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
        $details = Detail::findOrFail($id);
        if ($details->delete()) {
            return response()->json(['message' => 'deleted']);
        }
    }

    public function sort(Request $request)
    {
        if ($search = $request->id) {
            $company = Detail::with('companies', 'hospitals')->where('company', $search)->get();
        } else {
            $company = Detail::with('companies', 'hospitals')->latest()->paginate(20);
        }

        return $company;
    }

    public function sortHospital(Request $request)
    {
        if ($search = $request->id) {
            $hospital = Detail::with('companies', 'hospitals')->where('hospital', $search)->get();
        } else {
            $hospital = Detail::with('companies', 'hospitals')->latest()->paginate(20);
        }

        return $hospital;
    }

    public function sortname()
    {
        if ($search = \Request::get('q')) {
            $details = Detail::with('companies', 'hospitals')->where(function ($query) use ($search) {
                $query->where('payee', 'LIKE', "%$search%")
                    ->orWhere('voucher_no', 'LIKE', "%$search%");
            })->paginate(100);
        } else {
            $details = Detail::with('companies', 'hospitals')->latest()->paginate(20);
        }

        return $details;
    }

    public function sortDate()
    {
        if ($search = \Request::get('q')) {
            $details = Detail::with('companies', 'hospitals')->where(function ($query) use ($search) {
                $query->where('date', 'LIKE', "%$search%");
            })->paginate(100);
        } else {
            $details = Detail::with('companies', 'hospitals')->latest()->paginate(20);
        }

        return $details;
    }
}
