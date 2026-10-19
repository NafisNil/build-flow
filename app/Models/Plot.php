<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['plot_number', 'house_type', 'status', 'company_id', 'project_id'])]
class Plot extends Model
{
    use BelongsToCompany;
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function progress()
    {
        return $this->hasMany(PlotPhase::class);
    }

    public function defects()
    {
        return $this->hasMany(Defect::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
