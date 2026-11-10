import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/user.service';
import type { UserResponse } from '../types/user.types';
import {organizationService} from "../services/organization.service.ts";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [activeSlug, setActiveSlug] = useState<string>('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [userData, orgData] = await Promise.all([userService.getProfile(), organizationService.getMyOrganizations()])
                setUser(userData);
                setOrganizations(orgData);
                if(orgData.length > 0){
                    setActiveSlug(orgData[0].slug);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    }


    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-900 hidden sm:block">SBP</h1>
                        <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
                        {isLoading ? (
                            <span className="text-sm text-slate-500">Loading workspaces...</span>
                        ) : organizations.length > 0 ? (
                            <select
                                value={activeSlug}
                                onChange={(e) => setActiveSlug(e.target.value)}
                                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2 cursor-pointer outline-none"
                            >
                                {organizations.map(org => (
                                    <option key={org.id} value={org.slug}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="text-sm text-slate-500 italic">No workspaces found</span>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text=sm font-medium text-slate-700 hidden sm:block">
                                {isLoading ? 'Loading...' : user?.fullName}
                            </span>
                            <div className="w-10 h-10 rounded-full text-blue-600 bg-slate-100 flex items-center justify-center shadow-sm font-bold">
                                {isLoading ? '?' : user?.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-slate-600 hover:text-red-700 transition-colors"
                                >
                                Logout
                            </button>
                        </div>
                    </div>

                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Dashboard
                    </h2>
                    {activeSlug && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200">
                            Role: {organizations.find(o => o.slug === activeSlug)?.role}
                        </span>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                    <p className="text-slate-600 mb-2">
                        Welcome to the secure zone, <strong>{user?.fullName}</strong>!
                    </p>
                    <p className="text-sm text-slate-500">
                        Active Workspace: <strong>{organizations.find(o => o.slug === activeSlug)?.name || 'None'}</strong>
                    </p>
                </div>
            </main>

        </div>
    );
}