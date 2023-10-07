<?php

use App\Http\Controllers\PdfController;
use App\Http\Controllers\PriceConnectorsController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\PricePercentController;
use App\Http\Controllers\PriceStringersController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/panels', function () {
    return view('panels');
})->middleware(['auth', 'verified'])->name('panels');

Route::get('/stringers', function () {
    return view('stringers');
})->middleware(['auth', 'verified'])->name('stringers');

Route::get('/connectors', function () {
    return view('connectors');
})->middleware(['auth', 'verified'])->name('connectors');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group(['prefix' => 'price', 'as' => 'price.'], function () {
    Route::get('/price/panels/create/{id}', [PriceController::class, 'create'])->name('panels.create');
    Route::resource('/panels', PriceController::class)->except(['index', 'show', 'create', 'delete']);
    Route::get('/price/stringers/create/{id}', [PriceStringersController::class, 'create'])->name('stringers.create');
    Route::resource('/stringers', PriceStringersController::class)->except(['index', 'show', 'create', 'delete']);
    Route::get('/price/connectors/create/{id}', [PriceConnectorsController::class, 'create'])->name('connectors.create');
    Route::resource('/connectors', PriceConnectorsController::class)->except(['index', 'show', 'create', 'delete']);
});

Route::resource('/percent', PricePercentController::class)->except(['show', 'create', 'delete', 'store']);


Route::get('/generate-pdf', [PdfController::class, 'generatePDF']);
Route::get('/generate-pdf-test', [PdfController::class, 'test']);

require __DIR__.'/auth.php';

Route::get('/{other_pages}', function () {
    return view('react');
});

