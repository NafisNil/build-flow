<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Handover Compliance Bundle</title>
    <style>
        body { font-family: 'Helvetica', Arial, sans-serif; font-size: 12px; color: #333; }
        .header { border-bottom: 2px solid #1f2937; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .meta { font-size: 10px; color: #6b7280; }
        .section-title { font-size: 14px; font-weight: bold; background: #f3f4f6; padding: 5px; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        th { background-color: #f9fafb; font-size: 10px; text-transform: uppercase; }
        .photo-box { width: 150px; height: 100px; object-fit: cover; border: 1px solid #ccc; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">Handover & Compliance Bundle</h1>
        <p class="meta">Generated: {{ $generatedDate }} | Builder: {{ $company?->name ?? 'Independent Builder' }}</p>
    </div>

    <table>
        <tr>
            <th>Project</th>
            <td>{{ $plot->project->name }} ({{ $plot->project->postcode }})</td>
            <th>Plot Number</th>
            <td>{{ $plot->plot_number }}</td>
        </tr>
        <tr>
            <th>House Type</th>
            <td>{{ $plot->house_type }}</td>
            <th>Status</th>
            <td>{{ strtoupper($plot->status) }}</td>
        </tr>
    </table>

    <div class="section-title">Part L Compliance & Build Phases</div>
    <table>
        <thead>
            <tr>
                <th>Phase</th>
                <th>Status</th>
                <th>Completion Date</th>
                <th>Photographic Evidence</th>
            </tr>
        </thead>
        <tbody>
            @foreach($plot->progress as $record)
            <tr>
                <td>{{ $record->phase->sequence_order }}. {{ $record->phase->name }}</td>
                <td>{{ ucfirst($record->status) }}</td>
                <td>{{ $record->completed_at ? \Carbon\Carbon::parse($record->completed_at)->format('d/m/Y') : 'Pending' }}</td>
                <td>
                    @if($record->part_l_photo_path)
                        <!-- DOMPDF requires absolute local paths for images to render properly -->
                        <img src="{{ public_path('storage/' . $record->part_l_photo_path) }}" class="photo-box" alt="Part L Evidence">
                    @else
                        No Photo Attached
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="page-break"></div>

    <div class="section-title">Snagging & Defect Sign-off Log</div>
    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th>Issue Description</th>
                <th>Status</th>
                <th>Resolution Date</th>
                <th>NHBC Ref</th>
            </tr>
        </thead>
        <tbody>
            @forelse($plot->defects as $defect)
            <tr>
                <td style="text-transform: uppercase; font-size: 10px;">{{ $defect->category }}</td>
                <td><strong>{{ $defect->title }}</strong><br>{{ $defect->description }}</td>
                <td>{{ ucfirst($defect->status) }}</td>
                <td>{{ $defect->resolved_at ? \Carbon\Carbon::parse($defect->resolved_at)->format('d/m/Y') : 'N/A' }}</td>
                <td>{{ $defect->nhbc_claim_number ?? 'None' }}</td>
            </tr>
            @empty
            <tr>
                <td colSpan="5" style="text-align: center; color: #6b7280;">No defects or snags recorded.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>