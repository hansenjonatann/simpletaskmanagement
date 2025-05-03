'use client'
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function  Sidebar () {


    const {data} = useSession()
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut().then(() => {
            toast.success('Logout success')
            router.push('/sign-in')            
        })
    }

    useEffect(() => {
        if(!data) {
            redirect('/sign-in')
        } else {
            return 
        }
    } , [data])
    
    const sidebarList = [
        {
            label: 'Task' , 
            path: '/dashboard/task'
        },
        {
            label: 'Category',
            path: '/dashboard/category'
        },
        
    ]
    return (
        <aside className="bg-blue-800 text-white h-[680px] m-4 rounded-xl ">
            
            <div className="p-4 flex flex-col  ">
                <div className="flex space-x-2 ">
                <h1 className="text-md font-bold text-center">Login as  </h1>
                <p className="text-md font-bold text-center "> {data?.user?.name}</p>
                </div>
                <div className="mt-8 flex flex-col gap-y-8">
                    <Link href={'/dashboard'} className="font-bold text-xl">Dashboard</Link>
                    {sidebarList.map((sidebar: any , idx: number) => (
                    <Link key={idx} href={sidebar.path} className={pathname == sidebar.path ? "bg-white p-2 rounded-lg text-blue-800 font-bold text-xl" : "font-bold text-xl"}>{sidebar.label}</Link>

                    ))}
                </div>
            </div>
                <div className="mx-2">
                <button onClick={handleSignOut} type="button" className="bg-red-500 text-white rounded-md mt-8 p-2 shadow-lg w-full">Sign Out</button>
                </div>


        </aside>
    )
}