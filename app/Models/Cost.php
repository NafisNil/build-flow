<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['company_id', 'project_id', 'phase_id', 'title', 'amount', 'type', 'notes'])]
class Cost extends Model
{
    use BelongsToCompany;
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function phase()
    {
        return $this->belongsTo(Phase::class);
    }
}
