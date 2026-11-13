import type {ProjectResponse} from "../types/workspace.types.ts";
import {useState} from "react";
import {projectService} from "../services/project.service.ts";


interface CreateProjectModalProps {
    orgSlug: string;
    onClose: () => void;
    onSuccess: (newProject: ProjectResponse) => void;
}

export default function CreateProjectModal({onClose, onSuccess, orgSlug}: CreateProjectModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');
        if (name.trim() === '') {
            setError('Project name is required');
            return;
        }
        setIsLoading(true);

        try {
            const newProject = await projectService.createProject(orgSlug, name, description);
            onSuccess(newProject);
        } catch (error) {
            setError('Failed to create project.')
            console.error('Error creating project:', error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Create New Project</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                            Project Name <span className="text-red-500 text-lg">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            placeholder="e.g., Q4 Marketing Campaign"
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                            Project Description
                        </label>
                        <textarea
                            rows={3}
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional details..."
                            className="mt-1 p-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center"
                        >
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )

}