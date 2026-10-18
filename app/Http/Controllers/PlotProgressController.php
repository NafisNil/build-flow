<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlotPhase;
use Illuminate\Support\Facades\Storage;

class PlotProgressController extends Controller
{
    //
    public function update(Request $request, PlotPhase $plotPhase)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,active,completed',
            'photo' => 'nullable|image|max:5120|mimes:jpeg,png,jpg,gif,svg',
        ]);

        $updateData = [
            'status' => $validated['status'],
        ];

        if($validated['status'] === 'completed' && !$plotPhase->completed_at) {
            $updateData['completed_at'] = now();
        }

        if($request->hasFile('photo')) {
            if($plotPhase->part_l_photo_path) {
                Storage::disk('public')->delete($plotPhase->part_l_photo_path);
            }
            $path = $request->file('photo')->store('part_l_photos', 'public');
            $updateData['part_l_photo_path'] = $path;
        }

        $plotPhase->update($updateData);

        return redirect()->back()->with('success', 'Plot progress updated successfully.');
    }
}
