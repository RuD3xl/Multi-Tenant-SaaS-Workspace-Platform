import type { OrganizationResponse } from '../types/organization.types';
import { api } from './api';

export const organizationService = {
    async getMyOrganizations(): Promise<OrganizationResponse[]> {
        const response = await api.get<OrganizationResponse[]>('/orgs');
        return response.data;
    }
}