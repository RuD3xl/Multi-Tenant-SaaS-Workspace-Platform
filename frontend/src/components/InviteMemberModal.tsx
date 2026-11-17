import {useState} from "react";
import {memberService} from "../services/member.service.ts";
import type {MemberResponse} from "../types/workspace.types.ts";


interface InviteMemberModalProps {
    orgSlug: string;
    onClose: () => void;
    onSuccess: (inviteMember: MemberResponse) => void;
}

export default function InviteMemberModal({orgSlug, onClose, onSuccess}: InviteMemberModalProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('MEMBER');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const newMember = await memberService.inviteMember(orgSlug, email, role);
            console.log('Invite member response:', newMember);
            onSuccess(newMember);
        } catch (e: any) {
            console.error('Error inviting member:', e);

            if (e.response && e.response.status === 409) {
                setError('This user is already a member or already invited.');
            } else {
                setError('Failed to invite member.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Invite New Member</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., example@gmail.com"
                            className="mt-1 p-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 p-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                        >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center"
                        >
                            {isLoading ? 'Inviting...' : 'Invite Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}