import type {MemberResponse} from "../types/workspace.types.ts";
import {api} from "./api.ts";

export const memberService = {
    async getMembers(slug: string): Promise<MemberResponse[]> {
        const response = await api.get<MemberResponse[]>(`/orgs/${slug}/members`);
        return response.data;
    }
}