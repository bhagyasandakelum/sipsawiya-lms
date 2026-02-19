"use client"

import { useState, useEffect } from "react"
import { BookOpen, User, Plus, Search, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function ClassesPage() {
    const { data: session } = useSession()
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const isTeacher = session?.user?.role === "TEACHER"

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

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{isTeacher ? "My Classes" : "Browse Courses"}</h1>
                    <p className="text-muted-foreground mt-1">
                        {isTeacher ? "Manage your virtual classrooms and students." : "Discover new courses and start learning today."}
                    </p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search classes..."
                        className="pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition-all w-full md:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center py-32 glass rounded-3xl border-dashed">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold">No classes found</h3>
                    <p className="text-muted-foreground mt-2">Check back later or try a different search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div key={cls.id} className="glass rounded-3xl overflow-hidden hover:scale-[1.02] transition-all group border border-white/5">
                            <div className="h-40 premium-gradient relative">
                                <div className="absolute inset-0 bg-black/20" />
                                <BookOpen className="absolute bottom-4 left-4 text-white/50 w-8 h-8" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{cls.name}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 min-h-[40px]">
                                    {cls.description || "No description provided for this class."}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <User size={12} />
                                        </div>
                                        {cls.teacher?.name}
                                    </div>

                                    {!isTeacher && (
                                        <button
                                            onClick={() => handleEnroll(cls.id)}
                                            className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
                                        >
                                            <Plus size={14} /> Enroll
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
