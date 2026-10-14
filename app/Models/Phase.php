<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'sequence_order', 'status', 'target_completion_date', 'company_id', 'project_id'])]
class Phase extends Model
{
    use BelongsToCompany;

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
