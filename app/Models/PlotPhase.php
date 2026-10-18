<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['company_id', 'plot_id', 'phase_id', 'status', 'part_l_photo_path', 'completed_at'])]
class PlotPhase extends Model
{
    use BelongsToCompany;

    public function plot()
    {
        return $this->belongsTo(Plot::class);
    }

    public function phase()
    {
        return $this->belongsTo(Phase::class);
    }
}
