import { FormEvent } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Phase {
    id: number;
    name: string;
}

interface Cost {
    id: number;
    title: string;
    amount: string;
    type: 'estimated' | 'actual';
    phase: Phase | null;
    notes: string | null;
}

interface Project {
    id: number;
    name: string;
    phases: Phase[];
    costs: Cost[];
}

export default function ProjectFinancials({ project }: { project: Project }) {
    const { data, setData, post, processing, reset } = useForm({
        title: '',
        amount: '',
        type: 'actual',
        phase_id: '',
    });

    const submitManualCost = (e: FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/costs`, {
            onSuccess: () => reset(),
        });
    };

    const triggerAiEstimate = (phaseId: number) => {
        router.post(`/projects/${project.id}/phases/${phaseId}/ai-estimate`, {}, {
            preserveScroll: true,
        });
    };

    // Calculate totals
    const totalEstimated = project.costs
        .filter(c => c.type === 'estimated')
        .reduce((sum, current) => sum + parseFloat(current.amount), 0);
        
    const totalActual = project.costs
        .filter(c => c.type === 'actual')
        .reduce((sum, current) => sum + parseFloat(current.amount), 0);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Projects', href: '/projects' },
            { title: project.name, href: `/projects/${project.id}` },
            { title: 'Financials', href: `/projects/${project.id}/financials` }
        ]}>
            <Head title={`${project.name} Financials`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Dashboard Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                        <p className="text-sm font-medium text-gray-500">Total Estimated Budget</p>
                        <p className="text-2xl font-bold text-gray-900">£{totalEstimated.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                        <p className="text-sm font-medium text-gray-500">Total Actual Costs</p>
                        <p className="text-2xl font-bold text-gray-900">£{totalActual.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className={`p-6 shadow-sm ring-1 rounded-xl ${totalActual > totalEstimated && totalEstimated > 0 ? 'bg-red-50 ring-red-200' : 'bg-green-50 ring-green-200'}`}>
                        <p className={`text-sm font-medium ${totalActual > totalEstimated ? 'text-red-600' : 'text-green-600'}`}>Variance</p>
                        <p className={`text-2xl font-bold ${totalActual > totalEstimated ? 'text-red-900' : 'text-green-900'}`}>
                            £{(totalEstimated - totalActual).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Log Manual Cost Form */}
                    <div className="lg:col-span-1 bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Log Cost</h2>
                        <form onSubmit={submitManualCost} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cost Title</label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount (£)</label>
                                <input type="number" step="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value as 'estimated' | 'actual')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                    <option value="estimated">Estimated (Budget)</option>
                                    <option value="actual">Actual (Invoice)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Assign to Phase (Optional)</label>
                                <select value={data.phase_id} onChange={e => setData('phase_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                    <option value="">General Project Cost</option>
                                    {project.phases.map(phase => (
                                        <option key={phase.id} value={phase.id}>{phase.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" disabled={processing} className="w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700">
                                Save Entry
                            </button>
                        </form>

                        {/* AI Automation Shortcuts */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">AI Phase Estimator</h3>
                            <ul className="space-y-2">
                                {project.phases.map(phase => (
                                    <li key={phase.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 truncate mr-2">{phase.name}</span>
                                        <button onClick={() => triggerAiEstimate(phase.id)} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 whitespace-nowrap">
                                            Auto-Estimate
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Cost Ledger */}
                    <div className="lg:col-span-2 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Title</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phase</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 pr-4">Amount (£)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {project.costs.map((cost) => (
                                    <tr key={cost.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                            {cost.title}
                                            {cost.notes && <p className="text-xs text-gray-500 mt-1 font-normal">{cost.notes}</p>}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {cost.phase?.name || 'General'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${cost.type === 'actual' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {cost.type}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right pr-4 font-mono">
                                            {parseFloat(cost.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                                {project.costs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-sm text-gray-500">No costs logged yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}