import { useState } from 'react';
import { memberService } from '../services/member.service';
import type { WorkspaceInviteResponse } from '../types/workspace.types';

interface InvitesListProps {
    invites: WorkspaceInviteResponse[];
    onInviteResolved: () => void;
}

export default function InvitesList({ invites, onInviteResolved }: InvitesListProps) {
    const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

    if (invites.length === 0) return null;

    const handleAccept = async (slug: string) => {
        setLoadingSlug(slug);
        try {
            await memberService.acceptInvite(slug);
            onInviteResolved();
        } catch (error) {
            console.error('Failed to accept invite', error);
        } finally {
            setLoadingSlug(null);
        }
    };

    const handleReject = async (slug: string) => {
        setLoadingSlug(slug);
        try {
            await memberService.rejectInvite(slug);
            onInviteResolved();
        } catch (error) {
            console.error('Failed to reject invite', error);
        } finally {
            setLoadingSlug(null);
        }
    };

    return (
        <div className="mb-6 space-y-3">
            {invites.map((invite) => (
                <div key={invite.orgSlug} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900">
                            You have been invited to join <span className="font-bold">{invite.orgName}</span>
                        </h4>
                        <p className="text-xs text-blue-700 mt-1">
                            Role: <span className="font-medium">{invite.role}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleReject(invite.orgSlug)}
                            disabled={loadingSlug === invite.orgSlug}
                            className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50"
                        >
                            Decline
                        </button>
                        <button
                            onClick={() => handleAccept(invite.orgSlug)}
                            disabled={loadingSlug === invite.orgSlug}
                            className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                        >
                            {loadingSlug === invite.orgSlug ? 'Processing...' : 'Accept Invite'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}