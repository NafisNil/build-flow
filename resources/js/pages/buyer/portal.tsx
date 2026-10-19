import { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

interface Phase {
    id: number;
    name: string;
    sequence_order: number;
}

interface PlotPhase {
    id: number;
    status: 'pending' | 'active' | 'completed';
    part_l_photo_path: string | null;
    completed_at: string | null;
    phase: Phase;
}

interface Defect {
    id: number;
    title: string;
    description: string;
    status: string;
    category: string;
    created_at: string;
}

interface Plot {
    id: number;
    plot_number: string;
    house_type: string;
    status: string;
    project: { name: string; postcode: string | null };
    progress: PlotPhase[];
    defects: Defect[];
}

export default function BuyerPortal({ plot }: { plot: Plot | null }) {
    const [activeTab, setActiveTab] = useState<'timeline' | 'snags'>('timeline');

    // Form for logging a defect/snag
    const defectForm = useForm({
        title: '',
        description: '',
        category: 'cosmetic',
        photo: null as File | null,
    });

    const submitDefect = (e: FormEvent) => {
        e.preventDefault();
        if (!plot) return;
        
        defectForm.post(`/plots/${plot.id}/defects`, {
            preserveScroll: true,
            onSuccess: () => defectForm.reset('title', 'description', 'photo'),
        });
    };

    if (!plot) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Plot Assigned</h2>
                    <p className="text-sm text-gray-500">Your buyer account is not currently linked to an active home. Please contact your site manager.</p>
                </div>
            </div>
        );
    }

    const completedPhases = plot.progress.filter(p => p.status === 'completed').length;
    const progressPercent = Math.round((completedPhases / (plot.progress.length || 1)) * 100);

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={`My Home - Plot ${plot.plot_number}`} />

            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-gray-900 text-lg">{plot.project.name}</h1>
                        <p className="text-xs text-gray-500">Plot {plot.plot_number} • {plot.house_type}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 uppercase">
                        {plot.status}
                    </span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Overall Progress Banner */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Overall Build Completion</p>
                            <h2 className="text-3xl font-extrabold mt-1">{progressPercent}%</h2>
                        </div>
                        <p className="text-sm text-gray-300 font-medium">{completedPhases} of {plot.progress.length} Phases Passed</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('timeline')}
                        className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-colors ${
                            activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Construction Timeline
                    </button>
                    <button
                        onClick={() => setActiveTab('snags')}
                        className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-colors ${
                            activeTab === 'snags' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Aftercare & Snagging ({plot.defects.length})
                    </button>
                </div>

                {/* Tab 1: Construction Timeline */}
                {activeTab === 'timeline' && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-6">Build Stages & Milestone Photos</h3>
                        <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
                            {plot.progress.map((record) => (
                                <div key={record.id} className="relative pl-6">
                                    {/* Timeline Marker */}
                                    <div className={`absolute -left-[9px] top-0.5 h-4 w-4 rounded-full border-2 bg-white ${
                                        record.status === 'completed' ? 'border-green-500 bg-green-500' :
                                        record.status === 'active' ? 'border-blue-600 bg-blue-600 animate-pulse' : 'border-gray-300'
                                    }`} />

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{record.phase.sequence_order}. {record.phase.name}</h4>
                                            <p className="text-xs text-gray-500 capitalize">Status: {record.status}</p>
                                        </div>
                                        {record.completed_at && (
                                            <span className="text-xs text-gray-400">Completed on {new Date(record.completed_at).toLocaleDateString()}</span>
                                        )}
                                    </div>

                                    {/* Display Milestone / Part L Evidence Photo to Buyer */}
                                    {record.part_l_photo_path && (
                                        <div className="mt-3">
                                            <img
                                                src={`/storage/${record.part_l_photo_path}`}
                                                alt={`Milestone evidence for ${record.phase.name}`}
                                                className="w-48 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 2: Snagging & Defects Form */}
                {activeTab === 'snags' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Report Form */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                            <h3 className="text-base font-bold text-gray-900 mb-4">Report an Issue</h3>
                            <form onSubmit={submitDefect} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700">Issue Title</label>
                                    <input
                                        type="text"
                                        value={defectForm.data.title}
                                        onChange={e => defectForm.setData('title', e.target.value)}
                                        required
                                        placeholder="e.g. Loose door handle in main bedroom"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700">Category</label>
                                    <select
                                        value={defectForm.data.category}
                                        onChange={e => defectForm.setData('category', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="cosmetic">Cosmetic / Snag</option>
                                        <option value="plumbing">Plumbing</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="structural">Structural</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700">Description</label>
                                    <textarea
                                        rows={3}
                                        value={defectForm.data.description}
                                        onChange={e => defectForm.setData('description', e.target.value)}
                                        required
                                        placeholder="Describe the issue in detail..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={defectForm.processing}
                                    className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-blue-500 disabled:opacity-50"
                                >
                                    Submit Ticket
                                </button>
                            </form>
                        </div>

                        {/* Reported Tickets List */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-base font-bold text-gray-900 mb-4">Your Reported Tickets</h3>
                            <div className="space-y-4">
                                {plot.defects.map(defect => (
                                    <div key={defect.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{defect.category}</span>
                                            <h4 className="text-sm font-bold text-gray-900">{defect.title}</h4>
                                            <p className="text-xs text-gray-600 mt-1">{defect.description}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                                            defect.status === 'signed-off' ? 'bg-green-100 text-green-800' :
                                            defect.status === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {defect.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                ))}
                                {plot.defects.length === 0 && (
                                    <p className="text-xs text-gray-400 text-center py-8">No tickets reported yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}