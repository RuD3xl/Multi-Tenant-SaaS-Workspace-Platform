import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/user.service';
import type { UserResponse } from '../types/user.types';
import {organizationService} from "../services/organization.service.ts";
import { workspaceService } from '../services/workspace.service';
import type { OrganizationResponse } from '../types/organization.types';
import type { MemberResponse } from "../types/workspace.types.ts";
import type { ProjectResponse } from "../types/workspace.types.ts";


export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [user, setUser] = useState<UserResponse | null>(null);
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [activeSlug, setActiveSlug] = useState<string>('');

    const [members, setMembers] = useState<MemberResponse[]>([]);
    const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
    const [isProjectLoading, setIsProjectLoading] = useState(false);
    const [isMemberLoading, setIsMemberLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'projects' | 'members'>('projects')
    const [projects, setProjects] = useState<ProjectResponse[]>([]);


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

    useEffect(() => {
        if (!activeSlug) return;

        const fetchWorkspace = async () => {
            setIsWorkspaceLoading(true);
            setIsProjectLoading(true);
            setIsMemberLoading(true);
            try {
                const projectData = await workspaceService.getProjects(activeSlug);
                setProjects(projectData);
            } catch (error) {
                setProjects([]);
                console.error('Failed to fetch members');
            } finally {
                setIsProjectLoading(false);
            }


            try {
                const memberData = await workspaceService.getMembers(activeSlug);
                setMembers(memberData);
                console.log(memberData);
            } catch (error) {
                setMembers([]);
                console.error('Failed to fetch members');
            } finally {
                setIsMemberLoading(false);
            }
            if(!isProjectLoading && !isMemberLoading){
                setIsWorkspaceLoading(false);
            }
        }
        fetchWorkspace();
    }, [activeSlug]);

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
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        {organizations.find(o => o.slug === activeSlug)?.name || 'Dashboard'}
                    </h2>

                    <div className="flex space-x-4 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'projects'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'members'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Team Members
                        </button>
                    </div>
                </div>

                {isWorkspaceLoading ? (
                    <div className="text-slate-500">Loading data...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                        {activeTab === 'projects' && (
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
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
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
                        )}

                        {activeTab === 'members' && (
                            <div className="p-0">
                                {(members || []).length > 0 ? (
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-200">
                                        {members.map((member) => (
                                            <tr key={member.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-slate-900">{member.name}</div>
                                                    <div className="text-sm text-slate-500">{member.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{member.role}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${member.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {member.status}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-6 text-slate-500 text-center">No members in this workspace.</div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </main>
        </div>
    );
}