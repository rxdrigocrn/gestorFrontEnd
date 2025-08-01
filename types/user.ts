
export const Role = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE',
    RESELLER: 'RESELLER',
} as const

export type UserBase = {
    name: string
    email: string
    password: string
    role: Role
    organizationId?: string
}

export type UserCreate = UserBase

export type UserUpdate = UserBase & {
    id: string
}

export type UserResponse = UserBase & {
    id: string
    createdAt: string
    updatedAt: string
}

export type UserList = UserResponse[]

