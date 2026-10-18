import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Phase {
    id: number;
    name: string;
    sequence_order: number;
}

interface PlotPhase {
    id: number;
    phase_id: number;
    status: string;
    part_l_photo_path: string | null;
    completed_at: string | null;
    phase: Phase;
}

interface Plot {
    id: number;
    plot_number: string;
    house_type: string;
    project: { id: number; name: string };
    progress: PlotPhase[];
}

// Sub-component for individual progress rows to manage separate form states
function ProgressRow({ progressRecord }: { progressRecord: PlotPhase }) {
    const { data, setData, post, processing, progress } = useForm({
        status: progressRecord.status,
        photo: null as File | null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(`/progress/${progressRecord.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 last:border-0">
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                    {progressRecord.phase.sequence_order}. {progressRecord.phase.name}
                </p>
                {progressRecord.completed_at && (
                    <p className="text-xs text-green-600 mt-1">
                        Completed: {new Date(progressRecord.completed_at).toLocaleDateString()}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <select
                    value={data.status}
                    onChange={e => setData('status', e.target.value)}
                    className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>

                <div className="w-48">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setData('photo', e.target.files ? e.target.files[0] : null)}
                        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {progress && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:opacity-50"
                >
                    Save
                </button>
            </div>

            {/* Display existing Part L evidence if uploaded */}
            {progressRecord.part_l_photo_path && (
                <div className="mt-2 sm:mt-0">
                    <a href={`/storage/${progressRecord.part_l_photo_path}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                        View Photo Evidence
                    </a>
                </div>
            )}
        </form>
    );
}

export default function PlotShow({ plot }: { plot: Plot }) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Projects', href: '/projects' },
            { title: plot.project.name, href: `/projects/${plot.project.id}` },
            { title: `Plot ${plot.plot_number}`, href: `/plots/${plot.id}` }
        ]}>
            <Head title={`Plot ${plot.plot_number} - Progress`} />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Plot {plot.plot_number} Progress
                    </h1>
                    <p className="text-sm text-gray-500">{plot.house_type}</p>
                </div>

                <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Construction Gates & Part L Evidence</h2>
                    <div className="mt-4">
                        {plot.progress.map((record) => (
                            <ProgressRow key={record.id} progressRecord={record} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}