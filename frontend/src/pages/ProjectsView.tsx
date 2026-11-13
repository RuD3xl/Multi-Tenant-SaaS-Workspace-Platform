import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import type {ProjectResponse} from "../types/workspace.types.ts";
import {projectService} from "../services/project.service.ts";
import CreateProjectModal from "../components/CreateProjectModal.tsx";

export default function ProjectsView() {
    const {slug} = useParams<{ slug: string }>();
    const [isProjectLoading, setIsProjectLoading] = useState(false);
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const FolderIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" {...props}>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44"/>
        </svg>
    );
    const FolderPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" {...props}>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44"/>
        </svg>
    );

    useEffect(() => {
        if (!slug) return;

        const fetchWorkspace = async () => {
            setIsProjectLoading(true);
            try {
                const projectData = await projectService.getProjects(slug);
                setProjects(projectData);
            } catch (error) {
                setProjects([]);
                console.error('Failed to fetch members');
            } finally {
                setIsProjectLoading(false);
            }

        }
        fetchWorkspace();
    }, [slug]);


    return (

        <>
            {isProjectLoading ? (
                <div className="text-slate-500">Loading data...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                    <header className="bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center justify-between px-4 py-1 sm:px-6">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
                            </div>
                            <div className="flex items-center ">
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="flex item-center gap-2 text-md  font-medium text-slate-900 hover:text-blue-700 transition-colors"
                                >
                                    <FolderPlusIcon className="h-6 w-6" aria-hidden="true"/>Create new
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="p-0">
                        {(projects || []).length > 0 ? (
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{project.name}</td>
                                        <td className="max-w-xs truncate px-6 py-4 whitespace-nowrap text-sm text-slate-500">{project.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                            {project.status}
                                                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-slate-500 text-center">
                                <span className="text-2xl font-bold text-slate-600 mb-2"><FolderIcon
                                    className="mx-auto h-12 w-12 text-slate-400"
                                    aria-hidden="true"/> No projects yet.</span>
                                <p className="text-xl text-slate-700">
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        Create
                                    </button>
                                    {' '}your first project to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isCreateModalOpen && slug && (
                <CreateProjectModal
                    orgSlug={slug}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={(newProject) => {
                        setProjects([...projects, newProject]);
                        setIsCreateModalOpen(false);
                    }}
                />
            )}
        </>
    );
}