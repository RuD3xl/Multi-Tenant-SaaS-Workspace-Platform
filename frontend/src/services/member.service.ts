import type {MemberResponse, WorkspaceInviteResponse} from "../types/workspace.types.ts";
import {api} from "./api.ts";

export const memberService = {
    async getMembers(slug: string): Promise<MemberResponse[]> {
        const response = await api.get<MemberResponse[]>(`/orgs/${slug}/members`);
        return response.data;
    },

    async inviteMember(slug: string, email: string, role: string): Promise<MemberResponse> {
        const response = await api.post<MemberResponse>(`/orgs/${slug}/members`, { email, role });
        return response.data;
    },

    async getMyInvites(): Promise<WorkspaceInviteResponse[]> {
        const response = await api.get<WorkspaceInviteResponse[]>('/users/me/invites');
        return response.data;
    },

    async acceptInvite(slug: string): Promise<void> {
        await api.post(`/orgs/${slug}/members/accept`);
    },

    async rejectInvite(slug: string): Promise<void> {
        await api.post(`/orgs/${slug}/members/reject`);
    }
}