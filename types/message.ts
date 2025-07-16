export type MessageTemplateBase = {
    name: string;
    content: string;
    imageUrl?: string;
}

export type MessageTemplateCreate = MessageTemplateBase

export type MessageTemplateUpdate = MessageTemplateBase & {
    id: string;
}

export type MessageTemplateResponse = MessageTemplateBase & {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export type MessageTemplateList = MessageTemplateResponse[];

