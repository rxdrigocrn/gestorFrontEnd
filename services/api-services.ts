import { api } from '@/services/api'

type Resource = string
type ID = string | number
type Data = Record<string, any>

export const fetchAll = async (resource: string, query: Record<string, any> = {}) => {
    const queryString = new URLSearchParams(
        Object.entries(query).reduce((acc, [key, val]) => {
            if (val !== undefined && val !== '') acc[key] = String(val)
            return acc
        }, {} as Record<string, string>)
    ).toString()

    const response = await api.get(`${resource}${queryString ? `?${queryString}` : ''}`)
    return response.data
}

export const fetchOne = async (resource: Resource, id: ID) => {
    const response = await api.get(`${resource}/${id}`)
    return response.data
}

export const createItem = async (resource: Resource, data: Data) => {
    const response = await api.post(resource, data)
    return response.data
}

export const updateItem = async (resource: Resource, id: ID, data: Data) => {
    const { id: _, organizationId, ...rest } = data
    const response = await api.patch(`${resource}/${id}`, rest)
    return response.data
}

export const toggleItem = async (resource: Resource, id: ID, data?: Data) => {
    const response = await api.patch(`${resource}/${id}`, data)
    return response.data
}

export const deleteItem = async (resource: Resource, id: ID) => {
    const response = await api.delete(`${resource}/${id}`)
    return response.data
}
