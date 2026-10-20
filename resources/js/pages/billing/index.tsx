import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface BillingProps {
    isSubscribed: boolean;
    stripePortalUrl: string | null;
}

export default function BillingIndex({ isSubscribed, stripePortalUrl }: BillingProps) {
    
    // Replace with your actual Stripe Price IDs from your Stripe Dashboard
    const plans = [
        {
            name: 'Standard Builder',
            price: '£99',
            interval: '/month',
            description: 'Perfect for local developers building up to 50 units a year.',
            priceId: 'price_1Qx...your_stripe_price_id_1',
            features: ['Up to 5 Active Projects', 'Standard AI Cost Estimator', 'Part L Compliance PDF Exports', 'Basic Aftercare Ticketing'],
        },
        {
            name: 'Enterprise Developer',
            price: '£249',
            interval: '/month',
            description: 'For regional housebuilders managing multiple large-scale sites.',
            priceId: 'price_1Qy...your_stripe_price_id_2',
            features: ['Unlimited Projects & Plots', 'Advanced AI Cost Variances', 'Custom Branded Handovers', 'Priority API Support'],
        }
    ];

    const handleCheckout = (priceId: string) => {
        router.post(route('billing.checkout'), { price_id: priceId });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Billing & Subscriptions', href: '/billing' }]}>
            <Head title="Billing" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Platform Subscription</h1>
                    <p className="mt-4 text-lg text-gray-500">Manage your billing, invoices, and platform tier.</p>
                </div>

                {isSubscribed ? (
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Subscription Active</h2>
                        <p className="text-gray-500 mb-8">Thank you for building with us. Your account is fully activated.</p>
                        
                        {stripePortalUrl && (
                            <a 
                                href={stripePortalUrl} 
                                className="inline-flex justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
                            >
                                Open Stripe Billing Portal
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
                        {plans.map((plan) => (
                            <div key={plan.name} className="rounded-3xl p-8 ring-1 ring-gray-200 bg-white shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                                    <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                                    <p className="mt-6 flex items-baseline gap-x-1">
                                        <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                                        <span className="text-sm font-semibold leading-6 text-gray-600">{plan.interval}</span>
                                    </p>
                                    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex gap-x-3">
                                                <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={() => handleCheckout(plan.priceId)}
                                    className="mt-8 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Subscribe to {plan.name}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}