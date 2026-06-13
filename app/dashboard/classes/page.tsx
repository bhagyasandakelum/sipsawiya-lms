"use client"

import { useState, useEffect } from "react"
import { BookOpen, User, Plus, Search, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ClassesPage() {
    const { user } = useAuth()
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const isTeacher = user?.role === "TEACHER"

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const url = isTeacher ? "/classes?mine=true" : "/classes"
                const res = await api.get(url)
                setClasses(res.data.data?.classes || res.data.data || [])
            } catch (err) {
                console.error("Failed to fetch classes", err)
            } finally {
                setLoading(false)
            }
        }
        fetchClasses()
    }, [isTeacher])

    const handleEnroll = async (classId: string) => {
        try {
            const res = await api.post("/enrollments", { classId })
            if (res.data.success) {
                alert("Enrolled successfully!")
                // Refresh list
                const url = isTeacher ? "/classes?mine=true" : "/classes"
                const listRes = await api.get(url)
                setClasses(listRes.data.data?.classes || listRes.data.data || [])
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to enroll")
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">{isTeacher ? "My Classes" : "Browse Courses"}</h1>
                    <p className="text-muted-foreground mt-1">
                        {isTeacher ? "Manage your virtual classrooms and students." : "Discover new courses and start learning today."}
                    </p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search classes..."
                            className="pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition-all w-full md:w-64"
                        />
                    </div>
                    {isTeacher && (
                        <Link href="/dashboard/classes/new" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all flex items-center gap-2 whitespace-nowrap">
                            <Plus size={18} />
                            Create Class
                        </Link>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center py-32 glass rounded-3xl border-2 border-dashed border-white/10">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold text-white">No classes found</h3>
                    <p className="text-muted-foreground mt-2">Check back later or try a different search.</p>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {classes.map((cls) => (
                        <motion.div key={cls.id} variants={itemVariants}>
                            <Link href={`/dashboard/classes/${cls.id}`} className="block glass rounded-3xl overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group border border-white/5">
                                <div className="h-40 premium-gradient relative" style={cls.thumbnail ? { backgroundImage: `url(${cls.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                                    <div className="absolute inset-0 bg-black/40" />
                                    <BookOpen className="absolute bottom-4 left-4 text-white/50 w-8 h-8" />
                                    {cls.year && (
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                                            {cls.year}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{cls.name}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 min-h-[40px]">
                                        {cls.description || "No description provided for this class."}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white">
                                                <User size={12} />
                                            </div>
                                            {cls.teacher?.name}
                                        </div>

                                        {!isTeacher && (
                                            cls.enrollments?.some((e: any) => e.studentId === user?.id) ? (
                                                <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                                                    Enrolled
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleEnroll(cls.id);
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
                                                >
                                                    <Plus size={14} /> Enroll
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
