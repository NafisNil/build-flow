<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Inertia\Inertia;
class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::latest()->get();
        return Inertia::render('projects/index', [
            'projects' => $projects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'postcode' => 'nullable|string',
            'status' => 'required|in:planning,active,completed,on-hold',
        ]);

        $project = Project::create(
            array_merge($validated, [
                'company_id' => $request->user()->company_id
            ])
        );

        return redirect()->back()->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        $project->load(['plots', 'phases']);
        return Inertia::render('projects/show', [
            'project' => $project
        ]);
    }
}
