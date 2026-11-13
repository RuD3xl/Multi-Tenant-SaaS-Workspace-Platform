import { useEffect, useState } from 'react';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import { userService } from '../services/user.service.ts';
import type { UserResponse } from '../types/user.types.ts';

import {organizationService} from "../services/organization.service.ts";
import type { OrganizationResponse } from '../types/organization.types.ts';

export default function DashboardLayout() {
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [activeSlug, setActiveSlug] = useState<string>('');
    const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" {...props}>
            <g fill="currentColor"><path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/><path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/></g>
        </svg>
    );
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [userData, orgData] = await Promise.all([
                    userService.getProfile(), organizationService.getMyOrganizations()
                ]);
                setUser(userData);
                setOrganizations(orgData);
                if(orgData.length > 0){
                    setActiveSlug(orgData[0].slug);

                    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/'){
                        navigate(`/dashboard/${orgData[0].slug}/projects`);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
                handleLogout();
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

    const handleOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSlug = e.target.value;
        setActiveSlug(newSlug);
        navigate(`/dashboard/${newSlug}/projects`);
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
                                onChange={handleOrganizationChange}
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
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">
                                {isLoading ? 'Loading...' : user?.fullName}
                            </span>
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold shadow-sm">
                                {isLoading ? '?' : user?.fullName?.charAt(0)}
                            </div>
                        </div>
                        <div className="h-6 w-px bg-slate-300"></div>
                        <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="text-slate-500">Loading workspace...</div>
                ) : organizations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <BuildingIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to SBP!</h2>
                        <p className="text-slate-500 mb-6 text-center max-w-md">
                            You don't belong to any workspaces yet. Create your first organization to start managing projects and teams.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                            Create Organization
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                {organizations.find(o => o.slug === activeSlug)?.name || 'Dashboard'}
                            </h2>

                            <div className="flex space-x-4 border-b border-slate-200">
                                <Link
                                    to={`/dashboard/${activeSlug}/projects`}
                                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                                        location.pathname.includes('/projects')
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    Projects
                                </Link>
                                <Link
                                    to={`/dashboard/${activeSlug}/members`}
                                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                                        location.pathname.includes('/members')
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    Team Members
                                </Link>
                            </div>
                        </div>

                        <Outlet />
                    </>
                )}
            </main>
        </div>
    );

}
