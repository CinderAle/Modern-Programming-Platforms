import { UserRoles } from '@/types/userRoles';

export type UserResponse = {
    login: string;
    role: UserRoles;
};
