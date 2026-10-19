<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'company_id',
    'plot_id',
    'title',
    'description',
    'category',
    'status',
    'nhbc_claim_number',
    'photo_path',
    'reported_at',
    'resolved_at',
])]
class Defect extends Model
{
    //
    use BelongsToCompany;
    protected $casts = [
        'reported_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function plot()
    {
        return $this->belongsTo(Plot::class);
    }

}
