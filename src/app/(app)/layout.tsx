"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { LogOutIcon, LayoutDashboardIcon, Share2Icon, UploadIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


const sidebarItems = [
    { href: "/", icon: LayoutDashboardIcon, label: "Home Page" },
    { href: "/social-share", icon: Share2Icon, label: "Social Share" },
    { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {

    const { signOut } = useClerk()
    const pathname = usePathname();
    const { user } = useUser();
    const sidebarRef = useRef<HTMLElement | null>(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);


    const router = useRouter();

    const handleLogout = async () => await signOut()


    useEffect(() => {

        const handleOpen = (e: MouseEvent) => {

            const target = e.target as Node;

            if (sidebarRef.current && !sidebarRef.current.contains(target)) {
                setSidebarOpen(false)
            }
        }

        if (sidebarOpen) {
            document.addEventListener("mousedown", handleOpen);
        }

        return () => {
            document.removeEventListener("mousedown", handleOpen);
        };


    }, [sidebarOpen])

    return (
        <div className="min-h-screen" >
            <div className="drawer lg:drawer-open min-h-screen">

                <input id="my-drawer-1" type="checkbox" className="drawer-toggle"
                    checked={sidebarOpen}
                    onChange={() => setSidebarOpen(!sidebarOpen)} />

                <div className="drawer-content bg-base-300">

                    <div className="navbar bg-base-100 shadow-sm lg:hidden text-white">
                        <div className="flex-none">
                            <button className="btn btn-square btn-ghost" onClick={() => setSidebarOpen(true)} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                            </button>
                        </div>
                        <div className="flex-1">
                            <a className="btn btn-ghost text-xl">My Cloud</a>
                        </div>

                        <div className="flex-none flex items-center space-x-4 mr-2">
                            {user && (
                                <div className="avatar">
                                    <div className="w-8 h-8 rounded-full">
                                        <img
                                            src={user.imageUrl}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <main className="grow">
                        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8 h-">
                            {children}
                        </div>
                    </main>
                </div>

                <div className="drawer-side text-white">
                    <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
                    <aside className="bg-base-200 w-64 h-full flex flex-col py-6 justify-between">
                        <ul className="menu bg-base-200   p-4 w-full">
                            {sidebarItems.map((item) => (
                                <li key={item.href} className="mb-4">
                                    <Link
                                        href={item.href}
                                        className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${pathname === item.href
                                            ? "bg-primary text-white"
                                            : "hover:bg-base-300"
                                            }`}
                                        onClick={() => {
                                            router.push(item.href);
                                            setSidebarOpen(false)
                                        }}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {
                            user &&
                            <div className="p-4">
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline btn-error w-full"
                                >
                                    <LogOutIcon className="mr-2 h-5 w-5" />
                                    Sign Out
                                </button>
                            </div>
                        }
                    </aside>

                </div>
            </div>
        </div>
    )
}

export default AppLayout