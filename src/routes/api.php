<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResources([
    'user' => 'API\UserController'
]);
Route::get('profile', 'API\UserController@profile');
Route::get('finduser', 'API\UserController@search');
Route::put('profile', 'API\UserController@updateProfile');
Route::apiResources([
    'companies' => 'API\CompanysController'
]);
Route::get('findcompany', 'API\CompanysController@search');
Route::apiResources([
    'hospitals' => 'API\HospitalsController'
]);
Route::get('findhospital', 'API\HospitalsController@search');
Route::apiResources(["details" => 'API\DetailsController']);
Route::get('sortcompany/{id}', 'API\DetailsController@sort');
Route::get('sorthospital/{id}', 'API\DetailsController@sortHospital');
Route::get('finddetails', 'API\DetailsController@sortname');
Route::apiResources(['dashboard' => 'API\DashboardController']);
