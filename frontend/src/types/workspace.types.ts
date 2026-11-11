export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface ProjectResponse {
    id: string;
    name: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface MemberResponse {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    joinedAt: string;
}