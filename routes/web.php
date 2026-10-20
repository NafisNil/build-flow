<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PlotController;
use App\Http\Controllers\PhaseController;
use App\Http\Controllers\PlotProgressController;
use App\Http\Controllers\CostController;
use App\Http\Controllers\DefectController;
use App\Http\Controllers\BuyerPortalController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Admin\TenantController;
use App\Http\Controllers\SubscriptionController;


Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/plots', [PlotController::class, 'store'])->name('plots.store');
    Route::post('projects/{project}/phases', [PhaseController::class, 'store'])->name('phases.store');
    Route::post('/progress/{plotPhase}', [PlotProgressController::class, 'update'])->name('progress.update');
    Route::get('/plots/{plot}', [PlotController::class, 'show'])->name('plots.show');

    Route::get('/projects/{project}/financials', [CostController::class, 'index'])->name('projects.financials');
    Route::post('/projects/{project}/costs', [CostController::class, 'store'])->name('costs.store');
    Route::post('/projects/{project}/phases/{phase}/ai-estimate', [CostController::class, 'generateAiEstimate'])->name('costs.ai');

    Route::get('/aftercare', [DefectController::class, 'index'])->name('aftercare.index');
    Route::post('/plots/{plot}/defects', [DefectController::class, 'store'])->name('defects.store');
    Route::post('/defects/{defect}', [DefectController::class, 'update'])->name('defects.update');

    Route::get('/my-home', [BuyerPortalController::class, 'index'])->name('buyer.portal');
    Route::get('/plots/{plot}/handover-report', [ReportController::class, 'generateHandoverBundle'])->name('reports.handover');

    Route::get('/billing', [SubscriptionController::class, 'index'])->name('billing.index');
    Route::post('/billing/checkout', [SubscriptionController::class, 'checkout'])->name('billing.checkout');
    Route::get('/billing/portal', [SubscriptionController::class, 'portal'])->name('billing.portal');
});
Route::middleware(['auth', 'verified', 'super-admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('tenants', [TenantController::class, 'index'])->name('tenants');
});

require __DIR__.'/settings.php';
