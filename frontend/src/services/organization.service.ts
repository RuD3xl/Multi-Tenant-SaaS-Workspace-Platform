    import type { OrganizationResponse } from '../types/organization.types';
    import { api } from './api';

    export const organizationService = {
        async getMyOrganizations(): Promise<OrganizationResponse[]> {
            const response = await api.get<OrganizationResponse[]>('/orgs');
            return response.data;
        },

        async createOrganization(name: string, slug: string): Promise<OrganizationResponse> {
            const response = await api.post<OrganizationResponse>('/orgs', { name, slug });
            return response.data;
        },
    }