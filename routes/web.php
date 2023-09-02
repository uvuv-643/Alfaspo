<?php

use App\Http\Controllers\PdfController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\PricePercentController;
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

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/price/create/{id}', [PriceController::class, 'create'])->name('price.create');
Route::resource('/price', PriceController::class)->except(['index', 'show', 'create', 'delete']);
Route::resource('/percent', PricePercentController::class)->except(['show', 'create', 'delete', 'store']);


Route::get('/generate-pdf', [PdfController::class, 'generatePDF']);
Route::get('/generate-pdf-test', [PdfController::class, 'test']);

require __DIR__.'/auth.php';

Route::get('/{other_pages}', function () {
    return view('react');
});

