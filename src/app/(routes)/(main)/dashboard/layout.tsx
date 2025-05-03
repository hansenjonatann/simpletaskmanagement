'use client'

import type React from "react";
import Sidebar from "./_components/sidebar";

export default function DashboardLayout ({children} : {children: React.ReactNode}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="">
                <Sidebar/>
            </div>
            <div className="col-span-4 m-4">
                {children}

            </div>
        </div>
    )
}