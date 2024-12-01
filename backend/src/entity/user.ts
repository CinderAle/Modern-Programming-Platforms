import { UserRoles } from '@/types/userRoles';

type MutableUser = {
    id: string;
    role: UserRoles;
    login: string;
    password: string;
};

export type User = Readonly<MutableUser>;
