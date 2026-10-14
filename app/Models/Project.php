<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'postcode', 'company_id', 'status'])]
class Project extends Model
{
    use BelongsToCompany;
    public function plots()
    {
        return $this->hasMany(Plot::class);
    }
    
    public function phases()
    {
        return $this->hasMany(Phase::class)->orderBy('sequence_order');
    }
    
}
