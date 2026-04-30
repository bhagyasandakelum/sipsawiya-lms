"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    BookOpen,
    Video,
    PlusCircle,
    User,
    LogOut,
    GraduationCap,
    Menu,
    X,
    Loader2
} from "lucide-react"
import { useState, useEffect } from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // For now, bypass login as requested by user
    /*
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])
    */

    // if (status === "loading") {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    //         </div>
    //     )
    // }

    // Mock session if real session is not available
    const mockSession = {
        user: {
            id: "teacher-id-123",
            name: "Dev Teacher",
            email: "teacher@example.com",
            role: "TEACHER",
            image: null
        }
    }

    const currentSession: any = session || (status === "loading" ? null : mockSession);

    if (status === "loading" && !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!currentSession) return null

    const isTeacher = currentSession.user.role === "TEACHER"

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: BookOpen, label: isTeacher ? "My Classes" : "My Enrollments", href: "/dashboard/classes" },
        { icon: Video, label: "Materials", href: "/dashboard/materials" },
        { icon: User, label: "Profile", href: "/dashboard/profile" },
    ]

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className={`fixed md:relative z-40 h-full glass border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} overflow-y-auto overflow-x-hidden scrollbar-hide`}>
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-10 px-2 mt-2">
                        {isSidebarOpen ? (
                            <Link href="/" className="flex items-center gap-2">
                                <GraduationCap className="w-8 h-8 text-blue-400" />
                                <span className="text-xl font-bold tracking-tight text-white">Sipsawiya</span>
                            </Link>
                        ) : (
                            <GraduationCap className="w-8 h-8 text-blue-400 mx-auto" />
                        )}
                    </div>

                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <div key={item.label}>
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-muted-foreground hover:text-white group"
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                                </Link>
                                
                                {/* If this is the "My Classes" / "My Enrollments" item and sidebar is open, render fetched classes */}
                                {isSidebarOpen && (item.href === "/dashboard/classes") && (
                                    <SidebarClassesList isTeacher={isTeacher} />
                                )}
                            </div>
                        ))}

                        {isTeacher && isSidebarOpen && (
                            <div className="pt-8 pb-2 px-4 uppercase text-[10px] font-bold text-muted-foreground tracking-widest border-t border-white/5 mt-4">
                                Teacher Actions
                            </div>
                        )}

                        {isTeacher && (
                            <Link
                                href="/dashboard/classes/new"
                                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.1)]"
                            >
                                <PlusCircle className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-medium text-sm">Create Class</span>}
                            </Link>
                        )}
                    </nav>

                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all mt-auto"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 text-muted-foreground rounded-lg transition-all"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">{currentSession.user.name}</p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-widest">{currentSession.user.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center font-bold">
                            {currentSession.user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

function SidebarClassesList({ isTeacher }: { isTeacher: boolean }) {
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // To display all the enrolled / created classes 
                const res = await fetch("/api/classes")
                const data = await res.json()
                if (res.ok) {
                    setClasses(data)
                }
            } catch (err) {
                console.error("Failed to fetch classes for sidebar")
            } finally {
                setLoading(false)
            }
        }
        fetchClasses()
    }, [])

    if (loading) {
        return (
            <div className="pl-12 py-2 text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading classes...
            </div>
        )
    }

    if (classes.length === 0) {
        return <div className="pl-12 py-2 text-xs text-muted-foreground italic">No classes found.</div>
    }

    return (
        <div className="flex flex-col gap-1 mt-1 mb-3">
            {classes.map((cls) => (
                <Link
                    key={cls.id}
                    href={`/dashboard/classes/${cls.id}`}
                    className="pl-12 pr-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all truncate border-l-2 border-transparent hover:border-blue-500 ml-2"
                >
                    {cls.name}
                </Link>
            ))}
        </div>
    )
}
