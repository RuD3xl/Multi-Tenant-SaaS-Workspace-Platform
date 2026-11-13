import {useState} from 'react';
import {organizationService} from '../services/organization.service';
import type {OrganizationResponse} from '../types/organization.types';

interface CreateOrgModalProps {
    onClose: () => void;
    onSuccess: (newOrg: OrganizationResponse) => void;
}

export default function CreateOrgModal({onClose, onSuccess}: CreateOrgModalProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) {
            setError('Organization Name is required');
            return;
        }
        setIsLoading(true);
        try {
            const newOrg = await organizationService.createOrganization(name, slug);
            onSuccess(newOrg);
        } catch (error) {
            setError('Failed to create organization. Slug might be taken.')
            console.error('Error creating organization:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Create New Organization</h3>
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
                            Organization Name <span className="text-red-500 text-lg">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            placeholder="e.g., My Organization"
                            onChange={(e) => {
                                const newName = e.target.value;
                                setName(newName);
                                setSlug(generateSlug(newName));
                            }}
                            className="mt-1 p-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={isLoading}
                        ></input>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                            Organization Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(generateSlug(e.target.value))}
                            placeholder="e.g., my-organization"
                            className="mt-1 p-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                        ></input>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-50 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center"
                        >
                            {isLoading ? 'Creating...' : 'Create Organization'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
        ;
}