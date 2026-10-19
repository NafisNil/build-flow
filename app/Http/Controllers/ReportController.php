<?php

namespace App\Http\Controllers;

use App\Models\Plot;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    //
    public function generateHandoverBundle(Request $request, Plot $plot)
    {
        if ($plot->company_id !== $request->user()->company_id) {
            abort(403, 'Unauthorized');
        }

        // Add 'company' to the eager load array
        $plot->load([
            'company',
            'project', 
            'progress.phase', 
            'defects'
        ]);

        // Pass the plot's company to the view instead of the user's company
        $pdf = Pdf::loadView('pdf.handover', [
            'plot' => $plot,
            'company' => $plot->company,
            'generatedDate' => now()->format('d M Y')
        ]);

        $filename = sprintf('Handover_Bundle_Plot_%s_%s.pdf', $plot->plot_number, $plot->project->name);
        
        return $pdf->download($filename);
    }
}
