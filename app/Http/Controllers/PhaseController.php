<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Phase;
use App\Models\Project;

class PhaseController extends Controller
{
    //
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sequence_order' => 'required|integer',
            'target_completion_date' => 'nullable|date',
        ]);

        $project->phases()->create(array_merge($validated, [
            'company_id' => $request->user()->company_id,
            'status' => 'planning' // default status for a new phase
        ]));

        return redirect()->back()->with('success', 'Phase created successfully.');
    }
}
