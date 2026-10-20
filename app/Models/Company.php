<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Laravel\Cashier\Billable;
#[Fillable(['name', 'nhbc_registration_number', 'domain'])]
class Company extends Model
{
    use Billable;
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
