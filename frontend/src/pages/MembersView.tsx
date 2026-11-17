import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import type {MemberResponse} from "../types/workspace.types.ts";
import {memberService} from "../services/member.service.ts";
import InviteMemberModal from "../components/InviteMemberModal.tsx";

export default function MembersView() {
    const {slug} = useParams<{ slug: string }>();

    const [isMemberLoading, setIsMemberLoading] = useState(false);
    const [members, setMembers] = useState<MemberResponse[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" {...props}>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0a3.375 3.375 0 0 1 6.75 0M3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.3 12.3 0 0 1 9.374 21C7.043 21 4.862 20.355 3 19.234"/>
        </svg>
    );

    useEffect(() => {
        if (!slug) return;

        const fetchMembers = async () => {
            setIsMemberLoading(true);
            try {
                const memberData = await memberService.getMembers(slug);
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
                    <header className="bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center justify-between px-4 py-1 sm:px-6">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-slate-900">Members</h2>
                            </div>
                            <div className="flex items-center ">
                                <button
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="flex item-center gap-2 text-md  font-medium text-slate-900 hover:text-blue-700 transition-colors"
                                >
                                    <UserPlusIcon className="h-6 w-6" aria-hidden="true"/>Invite member
                                </button>
                            </div>
                        </div>
                    </header>
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
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                    member.status === 'INVITED' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-slate-100 text-slate-800'
                                            }`}>
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
            {isInviteModalOpen && slug && (
                <InviteMemberModal
                    orgSlug={slug}
                    onclose={() => setIsInviteModalOpen(false)}
                    onSuccess={(newMember) => {
                        setMembers(prevMembers => [...prevMembers, newMember]);
                        setIsInviteModalOpen(false);
                    }}
                />
            )}
        </>
    );
}