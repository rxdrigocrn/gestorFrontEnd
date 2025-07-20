"use client"
import React, { useState } from "react"
import Header from "./header"
import Sidebar from "./sidebar"

export default function SidebarController({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 p-4 sm:p-6 w-full max-w-[100vw] overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
