<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plot;
use Inertia\Inertia;

class BuyerPortalController extends Controller
{
    public function index(Request $request)
    {
        $plots = Plot::where('user_id', $request->user()->id)->with(['project', 'progress.phases', 'defects'=> function($query) {
            $query->latest();
        }])->first();
        return Inertia::render('buyer/portal', [
            'plots' => $plots,
        ]);
    }
}
