import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Tenant {
    id: number;
    name: string;
    users_count: number;
    projects_count: number;
    created_at: string;
}

export default function TenantDashboard({ tenants }: { tenants: Tenant[] }) {
    const totalUsers = tenants.reduce((sum, t) => sum + t.users_count, 0);
    const totalProjects = tenants.reduce((sum, t) => sum + t.projects_count, 0);

    return (
        <AppLayout breadcrumbs={[{ title: 'Super Admin', href: '/admin/tenants' }]}>
            <Head title="SaaS Administration" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
                    <p className="text-sm text-gray-500">Manage builder tenants and track global usage metrics.</p>
                </div>

                {/* Global Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                        <p className="text-sm font-medium text-gray-500">Active Builders</p>
                        <p className="text-3xl font-bold text-gray-900">{tenants.length}</p>
                    </div>
                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                        <p className="text-sm font-medium text-gray-500">Total Registered Users</p>
                        <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                        <p className="text-sm font-medium text-gray-500">Total Projects Managed</p>
                        <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
                    </div>
                </div>

                {/* Tenants Data Table */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Builder Name</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Registered Users</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Active Projects</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Onboarded Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {tenants.map((tenant) => (
                                <tr key={tenant.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900">
                                        {tenant.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {tenant.users_count} users
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {tenant.projects_count} projects
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {new Date(tenant.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                                        No builders registered on the platform yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}