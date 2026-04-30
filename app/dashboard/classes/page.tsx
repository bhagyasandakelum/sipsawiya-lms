"use client"

import { useState, useEffect } from "react"
import { BookOpen, User, Plus, Search, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ClassesPage() {
    const { data: session } = useSession()
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const isTeacher = (session?.user as any)?.role === "TEACHER"

    useEffect(() => {
        fetch("/api/classes")
            .then(res => res.json())
            .then(data => {
                setClasses(data)
                setLoading(false)
            })
    }, [])

    const handleEnroll = async (classId: string) => {
        const res = await fetch("/api/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ classId }),
        })

        if (res.ok) {
            alert("Enrolled successfully!")
        } else {
            const data = await res.json()
            alert(data.error || "Failed to enroll")
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
                    <h1 className="text-3xl font-bold text-blue-950">{isTeacher ? "My Classes" : "Browse Courses"}</h1>
                    <p className="text-slate-500 mt-1">
                        {isTeacher ? "Manage your virtual classrooms and students." : "Discover new courses and start learning today."}
                    </p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search classes..."
                            className="pl-11 pr-4 py-2.5 rounded-xl bg-white border border-blue-100 outline-none focus:border-blue-500 transition-all w-full md:w-64 text-slate-800 placeholder:text-slate-400 shadow-sm"
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
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center py-32 bg-white/50 rounded-3xl border-2 border-dashed border-blue-100">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-950">No classes found</h3>
                    <p className="text-slate-500 mt-2">Check back later or try a different search.</p>
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
                            <Link href={`/dashboard/classes/${cls.id}`} className="block glass bg-white/60 rounded-3xl overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group border border-blue-100">
                                <div className="h-40 premium-gradient relative">
                                    <div className="absolute inset-0 bg-black/5" />
                                    <BookOpen className="absolute bottom-4 left-4 text-white/80 w-8 h-8" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-blue-950 group-hover:text-blue-600 transition-colors">{cls.name}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[40px]">
                                        {cls.description || "No description provided for this class."}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                <User size={12} />
                                            </div>
                                            {cls.teacher?.name}
                                        </div>

                                        {!isTeacher && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleEnroll(cls.id);
                                                }}
                                                className="px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md shadow-blue-600/20 hover:shadow-lg"
                                            >
                                                <Plus size={14} /> Enroll
                                            </button>
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
