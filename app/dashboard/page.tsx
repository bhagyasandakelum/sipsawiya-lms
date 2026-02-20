"use client"

import { useSession } from "next-auth/react"
import { BookOpen, Users, Video, Clock, ArrowUpRight, Bell } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    const { data: session } = useSession()
    const isTeacher = (session?.user as any)?.role === "TEACHER"

    const stats = isTeacher ? [
        { label: "Active Classes", value: "0", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Total Students", value: "0", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Materials", value: "0", icon: Video, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    ] : [
        { label: "Enrolled Classes", value: "0", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Hours Learned", value: "0", icon: Clock, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Materials", value: "0", icon: Video, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}!</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening with your classes today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass p-6 rounded-3xl relative overflow-hidden group">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all ${stat.color}`}>
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-muted-foreground justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                            <p>No recent activity found.</p>
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {isTeacher ? (
                            <>
                                <Link href="/dashboard/classes" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500 transition-all text-left group">
                                    <div className="p-2 w-fit bg-blue-500/10 rounded-lg mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <PlusCircle size={20} />
                                    </div>
                                    <p className="font-bold text-sm">Create Class</p>
                                </Link>
                                <button
                                    onClick={() => {
                                        const content = prompt("Enter your notice content:")
                                        if (content) {
                                            fetch("/api/notices", {
                                                method: "POST",
                                                body: JSON.stringify({ content }),
                                            }).then(res => {
                                                if (res.ok) alert("Notice published!")
                                                else alert("Failed to publish notice")
                                            })
                                        }
                                    }}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500 transition-all text-left group"
                                >
                                    <div className="p-2 w-fit bg-purple-500/10 rounded-lg mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <Bell size={20} />
                                    </div>
                                    <p className="font-bold text-sm">Publish Notice</p>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/teachers" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500 transition-all text-left group">
                                    <div className="p-2 w-fit bg-blue-500/10 rounded-lg mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Users size={20} />
                                    </div>
                                    <p className="font-bold text-sm">Find Teachers</p>
                                </Link>
                                <Link href="/dashboard/classes" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500 transition-all text-left group">
                                    <div className="p-2 w-fit bg-purple-500/10 rounded-lg mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <BookOpen size={20} />
                                    </div>
                                    <p className="font-bold text-sm">My Classes</p>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function PlusCircle({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
    )
}
