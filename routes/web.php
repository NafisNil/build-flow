<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PlotController;
use App\Http\Controllers\PhaseController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/plots', [PlotController::class, 'store'])->name('plots.store');
    Route::post('projects/{project}/phases', [PhaseController::class, 'store'])->name('phases.store');


});

require __DIR__.'/settings.php';
