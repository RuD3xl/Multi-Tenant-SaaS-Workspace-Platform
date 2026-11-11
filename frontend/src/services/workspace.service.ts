import { api }from './api';
import type { Page, ProjectResponse, MemberResponse } from '../types/workspace.types'

export const workspaceService = {
    async getProjects(slug: string, status: string = 'ACTIVE'): Promise<ProjectResponse[]> {
        const response = await api.get<Page<ProjectResponse>>(`/orgs/${slug}/projects?status=${status}`);
        return response.data.content;
    },

    async getMembers(slug: string): Promise<MemberResponse[]> {
        const response = await api.get<MemberResponse[]>(`/orgs/${slug}/members`);
        return response.data;
    }

}