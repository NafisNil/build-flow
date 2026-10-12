<?php

namespace App\Concerns;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Company;

trait BelongsToCompany
{
    //
    protected static function booted(){
        static::addGlobalScope('company', function (Builder $builder) {
            if (auth()->check() && auth()->user()->company_id !== null) {
                $builder->where('company_id', auth()->user()->company_id);
            }
        });
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
