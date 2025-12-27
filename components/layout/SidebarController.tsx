"use client"
import React, { useState } from "react"
import Header from "./header"
import Sidebar from "./sidebar"

export default function SidebarController({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex min-h-screen">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
