import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Project {
    id: number;
    name: string;
}

interface Plot {
    id: number;
    plot_number: string;
    project: Project;
}

interface Defect {
    id: number;
    title: string;
    description: string;
    category: string;
    status: 'reported' | 'scheduled' | 'fixed' | 'signed-off';
    nhbc_claim_number: string | null;
    photo_path: string | null;
    reported_at: string;
    plot: Plot;
}

export default function AftercareIndex({ defects }: { defects: Defect[] }) {
    const statuses = ['reported', 'scheduled', 'fixed', 'signed-off'] as const;

    const updateStatus = (defectId: number, newStatus: string) => {
        // Using POST because we defined the route as POST on Day 10
        router.post(`/defects/${defectId}`, {
            status: newStatus,
        }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Aftercare & Warranty', href: '/aftercare' }]}>
            <Head title="Aftercare Dashboard" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Warranty & Defect Tracking</h1>
                    <p className="text-sm text-gray-500">Manage post-completion snags and NHBC claims across all active developments.</p>
                </div>

                {/* Kanban Board Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statuses.map(status => (
                        <div key={status} className="flex flex-col bg-gray-50 rounded-xl p-4 min-h-[500px]">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                                {status.replace('-', ' ')}
                                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs text-gray-700">
                                    {defects.filter(d => d.status === status).length}
                                </span>
                            </h2>
                            
                            <div className="space-y-4 flex-1">
                                {defects.filter(d => d.status === status).map(defect => (
                                    <div key={defect.id} className="bg-white p-4 shadow-sm ring-1 ring-gray-900/5 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-semibold text-gray-500 uppercase">
                                                {defect.category}
                                            </span>
                                            <select 
                                                value={defect.status}
                                                onChange={(e) => updateStatus(defect.id, e.target.value)}
                                                className="block rounded-md border-0 py-1 pl-2 pr-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs focus:ring-2 focus:ring-inset focus:ring-blue-600"
                                            >
                                                <option value="reported">Reported</option>
                                                <option value="scheduled">Scheduled</option>
                                                <option value="fixed">Fixed</option>
                                                <option value="signed-off">Signed Off</option>
                                            </select>
                                        </div>
                                        
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">{defect.title}</h3>
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{defect.description}</p>
                                        
                                        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1">
                                            <span className="text-xs font-medium text-gray-800">
                                                {defect.plot.project.name} - Plot {defect.plot.plot_number}
                                            </span>
                                            {defect.nhbc_claim_number && (
                                                <span className="text-xs text-orange-600 font-semibold">
                                                    NHBC: {defect.nhbc_claim_number}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {defects.filter(d => d.status === status).length === 0 && (
                                    <div className="text-center py-8 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                        No tickets
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}