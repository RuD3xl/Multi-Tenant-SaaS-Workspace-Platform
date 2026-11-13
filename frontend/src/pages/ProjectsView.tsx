import { useParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import type {ProjectResponse} from "../types/workspace.types.ts";
import {workspaceService} from "../services/workspace.service.ts";

export default function ProjectsView() {
    const { slug } = useParams<{ slug: string }>();
    const [ isProjectLoading, setIsProjectLoading ] = useState(false);
    const [ projects, setProjects ] = useState<ProjectResponse[]>([]);

    useEffect(() => {
        if (!slug) return;

        const fetchWorkspace = async () => {
            setIsProjectLoading(true);
            try {
                const projectData = await workspaceService.getProjects(slug);
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
                            <div className="p-6 text-slate-500 text-center">No projects found. Create one!</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}