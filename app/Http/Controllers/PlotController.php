<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plot;
use App\Models\Project;


class PlotController extends Controller
{
    //
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'plot_number' => 'required|string|max:255',
            'house_type' => 'required|string|max:255',
            'status' => 'required|in:off-plan,sold,reserved,handed-over',
        ]);

        $project->plots()->create(array_merge($validated, [
            'company_id' => $request->user()->company_id
        ]));

        return redirect()->back()->with('success', 'Plot created successfully.');
    }
}
