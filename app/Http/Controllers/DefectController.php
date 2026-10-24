<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Defect;
use App\Models\Plot;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\DefectReportedMail;

class DefectController extends Controller
{
    //
    public function index()
    {
        $defects = Defect::with('plot.project')->orderByRaw("FIELD(status, 'reported', 'scheduled', 'fixed', 'signed-off')")->latest()->get();
        return Inertia::render('aftercare/index', [
            'defects' => $defects,
        ]);
    }

    public function store(Request $request, Plot $plot)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:structural,cosmetic,other,electrical,plumbing',
             'photo' => 'nullable|image|max:2048',  
        ]);
        $data = [
            'company_id' => $request->user()->company_id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'],
            'status' => 'reported',
        ];
        if (isset($validated['photo'])) {
            $data['photo_path'] = Storage::put('defects', $validated['photo']);
        }

        $defect = $plot->defects()->create($data);
        $defect->load(['plot.project']);
        $companyEmail = $request->user()->company->email ?? $request->user()->email;
        Mail::to($companyEmail)->send(new DefectReportedMail($defect));
        return redirect()->back();
    }

    public function update(Request $request, Defect $defect){
        $validated = $request->validate([
            'status' => 'required|in:reported,scheduled,fixed,signed-off',
            'nhbc_claim_number' => 'nullable|string|max:255',
        ]);

        $updateData = $validated;
        if($validated['status'] === 'signed-off' && !$defect->resolved_at) {
            $updateData['resolved_at'] = now();
        }

        $defect->update($updateData);
        return redirect()->back();
    }
}
