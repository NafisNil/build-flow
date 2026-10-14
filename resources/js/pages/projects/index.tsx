import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Project {
    id: number;
    name: string;
    postcode: string | null;
    status: string;
    created_at: string;
}

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        postcode: '',
        status: 'planning',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/projects', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Projects', href: '/projects' }]}>
            <Head title="Projects" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Create Project Form */}
                <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Create New Project</h2>
                    <form onSubmit={submit} className="mt-4 sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Project Name (e.g., Oakwood Estate)"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Postcode"
                                value={data.postcode}
                                onChange={e => setData('postcode', e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="on-hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            Create Project
                        </button>
                    </form>
                </div>

                {/* Project List */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Postcode</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Manage</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {project.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{project.postcode}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                            project.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                                            project.status === 'planning' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' : 
                                            'bg-gray-50 text-gray-600 ring-gray-500/10'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <a href={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-900">
                                            Manage<span className="sr-only">, {project.name}</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                                        No projects found. Create one above to get started.
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