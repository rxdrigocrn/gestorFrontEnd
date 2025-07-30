export type Log = {
    id: string;
    description: string;
    timestamp: string;
    name: string;
    user?: {
        name: string;
    };
    userId?: string;
    organizationId?: string;
}
