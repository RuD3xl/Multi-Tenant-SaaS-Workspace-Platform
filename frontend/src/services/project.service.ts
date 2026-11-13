import type {Page, ProjectResponse} from "../types/workspace.types.ts";
import {api} from "./api.ts";

export const projectService = {
    async getProjects(slug: string, status: string = 'ACTIVE'): Promise<ProjectResponse[]> {
        const response = await api.get<Page<ProjectResponse>>(`/orgs/${slug}/projects?status=${status}`);
        return response.data.content;
    },

    async createProject(slug: string, name: string, description: string): Promise<ProjectResponse> {
        const response = await api.post<ProjectResponse>(`/orgs/${slug}/projects`, { name, description });
        return response.data;
    },
}