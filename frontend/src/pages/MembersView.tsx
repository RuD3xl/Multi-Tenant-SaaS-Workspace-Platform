import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import type { MemberResponse } from "../types/workspace.types.ts";
import { workspaceService } from "../services/workspace.service.ts";

export default function MembersView() {
    const { slug } = useParams<{ slug: string }>();
    const [isMemberLoading, setIsMemberLoading] = useState(false);
    const [members, setMembers] = useState<MemberResponse[]>([]);

    useEffect(() => {
        if (!slug) return;

        const fetchMembers = async () => {
            setIsMemberLoading(true);
            try {
                const memberData = await workspaceService.getMembers(slug);
                setMembers(memberData);
            } catch (error) {
                setMembers([]);
                console.error('Failed to fetch members', error);
            } finally {
                setIsMemberLoading(false);
            }
        }
        fetchMembers();
    }, [slug]);

    return (
        <>
            {isMemberLoading ? (
                <div className="text-slate-500">Loading data...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                </div>
            )}
        </>
    );
}