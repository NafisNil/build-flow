<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;

class TenantController extends Controller
{
    //
    public function index()
    {
        $tenants = Company::withCount(['users', 'projects'])->latest()->get();
        return Inertia::render('admin/tenants/index', [
            'tenants' => $tenants,
        ]);
    }

}
