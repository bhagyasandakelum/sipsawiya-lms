"use client"

import { useSession } from "next-auth/react"
import { BookOpen, Users, Video, Clock, ArrowUpRight, Bell, PlusCircle as PlusIcon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DashboardPage() {
    const { data: session } = useSession()
    const isTeacher = (session?.user as any)?.role === "TEACHER"

    const [classes, setClasses] = useState<any[]>([])
    const [stats, setStats] = useState<any[]>([])
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch("/api/classes")
                const data = await res.json()
                if (res.ok) {
                    setClasses(data)
                    
                    if (isTeacher) {
                        const totalStudents = data.reduce((acc: number, cls: any) => acc + (cls.enrollments?.length || 0), 0)
                        const totalMaterials = data.reduce((acc: number, cls: any) => acc + (cls.materials?.length || 0), 0)
                        
                        setStats([
                            { label: "Active Classes", value: data.length.toString(), icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10" },
                            { label: "Total Students", value: totalStudents.toString(), icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
                            { label: "Materials uploaded", value: totalMaterials.toString(), icon: Video, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                        ])

                        // Extract latest materials as recent activity
                        const activity: any[] = []
                        data.forEach((cls: any) => {
                            if (cls.materials) {
                                cls.materials.forEach((mat: any) => {
                                    activity.push({
                                        id: mat.id,
                                        title: `Uploaded '${mat.title}' in ${cls.name}`,
                                        date: mat.createdAt,
                                        type: "material"
                                    })
                                })
                            }
                        })
                        
                        // Sort by newest
                        activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        setRecentActivity(activity.slice(0, 5))
                        
                    } else {
                        const enrolledClasses = data.filter((cls: any) => 
                            cls.enrollments?.some((e: any) => e.studentId === (session?.user as any)?.id)
                        )

                        setStats([
                            { label: "Enrolled Classes", value: enrolledClasses.length.toString(), icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10" },
                            { label: "Available Courses", value: data.length.toString(), icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
                            { label: "Total Materials", value: enrolledClasses.reduce((acc: number, cls: any) => acc + (cls.materials?.length || 0), 0).toString(), icon: Video, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                        ])

                        // Extract latest materials as recent activity for students
                        const activity: any[] = []
                        enrolledClasses.forEach((cls: any) => {
                            if (cls.materials) {
                                cls.materials.forEach((mat: any) => {
                                    activity.push({
                                        id: mat.id,
                                        title: `New Material '${mat.title}' in ${cls.name}`,
                                        date: mat.createdAt,
                                        type: "material"
                                    })
                                })
                            }
                        })
                        
                        // Fetch notices
                        try {
                            const noticesRes = await fetch("/api/notices")
                            const noticesData = await noticesRes.json()
                            if (noticesRes.ok) {
                                noticesData.forEach((notice: any) => {
                                    activity.push({
                                        id: notice.id,
                                        title: `Notice from ${notice.teacher?.name}: ${notice.content.length > 50 ? notice.content.substring(0, 50) + "..." : notice.content}`,
                                        date: notice.createdAt,
                                        type: "notice"
                                    })
                                })
                            }
                        } catch(e) {}

                        // Sort by newest
                        activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        setRecentActivity(activity.slice(0, 5))
                    }
                }
            } catch (err) {
                console.error("Failed to fetch dashboard summary")
            } finally {
                setLoading(false)
            }
        }
        
        if (session) {
            fetchDashboardData()
        }
    }, [session, isTeacher])

    if (loading) {
        return <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="flex gap-6"><div className="h-32 bg-white/10 rounded flex-1"></div><div className="h-32 bg-white/10 rounded flex-1"></div><div className="h-32 bg-white/10 rounded flex-1"></div></div>
        </div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}!</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening with your classes today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass p-6 rounded-3xl relative overflow-hidden group">
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
                <div className="glass p-8 rounded-3xl flex flex-col h-full">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-4 flex-1">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((act) => (
                                <div key={act.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        act.type === "notice" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                                    }`}>
                                        {act.type === "notice" ? <Bell size={18} /> : <Clock size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{act.title}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(act.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-muted-foreground justify-center h-full py-12 border-2 border-dashed border-white/5 rounded-2xl">
                                <p>No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {isTeacher ? (
                            <>
                                <Link href="/dashboard/classes/new" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500 transition-all text-left group">
                                    <div className="p-2 w-fit bg-blue-500/10 rounded-lg mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <PlusIcon size={20} />
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
                                    <p className="font-bold text-sm">Browse Courses</p>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
