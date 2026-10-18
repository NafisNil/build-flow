<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plot;
use App\Models\Project;
use Inertia\Inertia;

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

        $plot = $project->plots()->create(array_merge($validated, [
            'company_id' => $request->user()->company_id
        ]));

        $phases = $project->phases;
        foreach ($phases as $phase) {
            $plot->progress()->create([
                'company_id' => $request->user()->company_id,
                'phase_id' => $phase->id,
                'status' => 'pending'
            ]);
        }

        return redirect()->back()->with('success', 'Plot created successfully.');
    }

    public function show(Plot $plot)
    {
        $plot->load(['project', 'progress.phase']);
        return Inertia::render('plots/show', [
            'plot' => $plot
        ]);
    }
}
