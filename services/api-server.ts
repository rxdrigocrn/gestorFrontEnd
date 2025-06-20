// lib/api-server.ts
'use server'

import axios from 'axios'
import { cookies } from 'next/headers'

export async function apiServer() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
        withCredentials: true,
    })

    return instance
}
