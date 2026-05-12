"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, ArrowRight, BookOpen, Users, Search, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function ClassesPage() {
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [enrolling, setEnrolling] = useState<string | null>(null)
    const router = useRouter()
    const { data: session, status } = useSession()

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/classes?q=${searchQuery}`)
                if (res.ok) {
                    const data = await res.json()
                    setClasses(data)
                }
            } catch (err) {
                console.error("Failed to fetch classes")
            } finally {
                setLoading(false)
            }
        }
        
        const timeoutId = setTimeout(() => {
            fetchClasses()
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    const handleEnroll = async (classId: string) => {
        if (status === "unauthenticated" || !session) {
            router.push("/login?callbackUrl=/classes")
            return
        }

        setEnrolling(classId)
        try {
            const res = await fetch("/api/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId })
            })

            if (res.ok) {
                router.push(`/dashboard/classes/${classId}`)
            } else {
                const data = await res.json()
                if (data.error === "Already enrolled in this class") {
                    router.push(`/dashboard/classes/${classId}`)
                } else {
                    alert(data.error || "Failed to enroll")
                }
            }
        } catch (err) {
            alert("Network error. Please try again.")
        } finally {
            setEnrolling(null)
        }
    }

    const filteredClasses = classes

    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-foreground selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold tracking-tight text-white">Sipsawiya</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/classes" className="text-white transition-colors">Classes</Link>
                    <Link href="/teachers" className="hover:text-white transition-colors">Teachers</Link>
                    <Link href="#" className="hover:text-white transition-colors">About</Link>
                </div>
                <div className="flex items-center gap-4">
                    {status === "authenticated" ? (
                        <Link href="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-500 transition-all shadow-md">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-blue-400 transition-colors">Login</Link>
                            <Link href="/register" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-all">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-32">
                
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-white">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Classes</span>
                    </h1>
                    <p className="text-muted-foreground text-lg mb-10">
                        Discover top classes and expert educators from around the world. Find your next subject and start learning today.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 glass text-white rounded-2xl border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-muted-foreground/50 shadow-lg"
                            placeholder="Search by class name or teacher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                        <p>Loading classes...</p>
                    </div>
                ) : filteredClasses.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl border border-white/5">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No classes found</h3>
                        <p className="text-muted-foreground">Try adjusting your search query to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredClasses.map((cls) => (
                            <div 
                                key={cls.id}
                                className="group flex flex-col sm:flex-row gap-6 glass border border-white/5 hover:border-white/10 p-6 rounded-3xl hover:bg-white-[0.02] transition-all shadow-sm"
                            >
                                <div className="w-full sm:w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative">
                                    {cls.thumbnail ? (
                                        <img src={cls.thumbnail} alt={cls.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <BookOpen className="w-12 h-12 text-blue-400/50 relative z-10" />
                                    )}
                                </div>
                                <div className="flex flex-col justify-between flex-1">
                                    <div>
                                        {cls.year && (
                                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold mb-3 inline-block">
                                                {cls.year}
                                            </span>
                                        )}
                                        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                                            {cls.name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                                <GraduationCap className="w-3 h-3 text-white/70" />
                                            </div>
                                            <span className="font-medium text-gray-300">{cls.teacher?.name || "Unknown Teacher"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            <span>{cls.enrollments?.length || 0} Students</span>
                                        </div>
                                        <button 
                                            onClick={() => handleEnroll(cls.id)}
                                            disabled={enrolling === cls.id}
                                            className="ml-auto text-white bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            {enrolling === cls.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>Enroll Now <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

