<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    //
    public function index(Request $request)
    {
        $company = $request->user()->company;
        return Inertia::render('billing/index', [
            'isSubscribed' => $company->subscribed('default'),
            'stripePortalUrl' => $company->stripe_id?route('billing.portal'):null
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'price_id' => 'required|string',
        ]);
        $company = $request->user()->company;
        return $company->newSubscription('default', $request->price_id)->checkout([
            'success_url' => route('dashboard').'?checkout=success',
            'cancel_url' => route('billing.index').'?checkout=cancelled',
        ]);
    }

    public function portal(Request $request)
    {
        $company = $request->user()->company;
        if (!$company->stripe_id) {
            return redirect()->back()->with('error', 'You do not have a Stripe account linked.');
        }
        return $request->user()->company->redirectToBillingPortal(route('billing.index'));
    }
}
