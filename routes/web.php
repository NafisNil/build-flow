<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PlotController;
use App\Http\Controllers\PhaseController;
use App\Http\Controllers\PlotProgressController;


Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/plots', [PlotController::class, 'store'])->name('plots.store');
    Route::post('projects/{project}/phases', [PhaseController::class, 'store'])->name('phases.store');
    Route::post('/progress/{plotPhase}', [PlotProgressController::class, 'update'])->name('progress.update');
    Route::get('/plots/{plot}', [PlotController::class, 'show'])->name('plots.show');

});

require __DIR__.'/settings.php';
