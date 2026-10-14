import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Plot {
    id: number;
    plot_number: string;
    house_type: string | null;
    status: string;
}

interface Phase {
    id: number;
    name: string;
    sequence_order: number;
    status: string;
    target_completion_date: string | null;
}

interface Project {
    id: number;
    name: string;
    status: string;
    plots: Plot[];
    phases: Phase[];
}

export default function ProjectShow({ project }: { project: Project }) {
    // Form for new Plot
    const plotForm = useForm({
        plot_number: '',
        house_type: '',
        status: 'off-plan',
    });

    // Form for new Phase
    const phaseForm = useForm({
        name: '',
        sequence_order: project.phases.length + 1,
        target_completion_date: '',
    });

    const submitPlot = (e: FormEvent) => {
        e.preventDefault();
        plotForm.post(`/projects/${project.id}/plots`, {
            onSuccess: () => plotForm.reset('plot_number', 'house_type'),
        });
    };

    const submitPhase = (e: FormEvent) => {
        e.preventDefault();
        phaseForm.post(`/projects/${project.id}/phases`, {
            onSuccess: () => phaseForm.reset('name', 'target_completion_date', 'sequence_order'),
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Projects', href: '/projects' },
            { title: project.name, href: `/projects/${project.id}` }
        ]}>
            <Head title={project.name} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{project.name} Management</h1>
                    <p className="text-sm text-gray-500">Status: {project.status.toUpperCase()}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Phases (Gates) Section */}
                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Build Phases & Gates</h2>
                        
                        <form onSubmit={submitPhase} className="mb-6 flex gap-2">
                            <input
                                type="text"
                                placeholder="Phase Name (e.g. Foundations)"
                                value={phaseForm.data.name}
                                onChange={e => phaseForm.setData('name', e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            />
                            <button type="submit" disabled={phaseForm.processing} className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700">
                                Add
                            </button>
                        </form>

                        <ul className="divide-y divide-gray-100">
                            {project.phases.map((phase) => (
                                <li key={phase.id} className="py-3 flex justify-between">
                                    <div className="flex items-center gap-x-3">
                                        <span className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">{phase.sequence_order}</span>
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{phase.name}</p>
                                    </div>
                                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                        {phase.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Plots Section */}
                    <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Plots (Units)</h2>
                        
                        <form onSubmit={submitPlot} className="mb-6 grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                placeholder="Plot 1"
                                value={plotForm.data.plot_number}
                                onChange={e => plotForm.setData('plot_number', e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            />
                            <input
                                type="text"
                                placeholder="3-Bed Semi"
                                value={plotForm.data.house_type}
                                onChange={e => plotForm.setData('house_type', e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            />
                            <button type="submit" disabled={plotForm.processing} className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700">
                                Add Plot
                            </button>
                        </form>

                        <ul className="divide-y divide-gray-100">
                            {project.plots.map((plot) => (
                                <li key={plot.id} className="py-3 flex justify-between">
                                    <div className="flex items-center gap-x-3">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{plot.plot_number}</p>
                                        <p className="text-sm text-gray-500">{plot.house_type}</p>
                                    </div>
                                    <span className="text-xs leading-6 text-gray-500 capitalize">{plot.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}