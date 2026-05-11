"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GraduationCap, BookOpen, MapPin, Search, Loader2 } from 'lucide-react'

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/teachers?q=${searchQuery}`)
                if (res.ok) {
                    const data = await res.json()
                    setTeachers(data)
                }
            } catch (err) {
                console.error("Failed to fetch teachers")
            } finally {
                setLoading(false)
            }
        }
        
        const timeoutId = setTimeout(() => {
            fetchTeachers()
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white">
            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold tracking-tight">Sipsawiya</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/classes" className="hover:text-white transition-colors">Classes</Link>
                    <Link href="/teachers" className="text-white transition-colors">Teachers</Link>
                    <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="#" className="hover:text-white transition-colors">About</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-white transition-colors">Login</Link>
                    <Link href="/register" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                            Elite Faculty
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
                            Meet Our <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Expert Educators
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Learn from the best minds in the industry. Our teachers are dedicated to your success and academic excellence.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/60 glass"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                        <p>Loading teachers...</p>
                    </div>
                ) : teachers.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl border border-white/5">
                        <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No teachers found</h3>
                        <p className="text-muted-foreground">Try adjusting your search query to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teachers.map((teacher: any) => (
                            <Link
                                key={teacher.id}
                                href={`/teachers/${teacher.id}`}
                                className="group relative rounded-3xl p-[1px] overflow-hidden hover:scale-[1.02] transition-all duration-300"
                            >
                                {/* Animated gradient border on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-colors duration-500" />
                                
                                <div className="relative h-full bg-[#0d0d0d] rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-white/10 group-hover:border-blue-400/50 transition-colors shrink-0">
                                                {teacher.image ? (
                                                    <img src={teacher.image} alt={teacher.name || 'Teacher'} className="w-full h-full object-cover" />
                                                ) : (
                                                    <GraduationCap className="w-10 h-10 text-blue-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 mb-1">
                                                    {teacher.name}
                                                </h3>
                                                <p className="text-blue-400 text-sm font-semibold tracking-wide uppercase">{teacher.degree || 'Expert Educator'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Subjects Expert In</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {(teacher.subjects?.split(',') || []).map((subject: string, idx: number) => (
                                                        <span key={idx} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs font-medium border border-white/10 text-gray-300">
                                                            {subject.trim()}
                                                        </span>
                                                    ))}
                                                    {!teacher.subjects && (
                                                        <span className="text-sm text-gray-500 italic">Not specified</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold delay-100">Teaching Classes</p>
                                                <div className="flex flex-col gap-2">
                                                    {teacher.taughtClasses && teacher.taughtClasses.length > 0 ? (
                                                        teacher.taughtClasses.map((aclass: any, idx: number) => (
                                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                                                <BookOpen className="w-4 h-4 text-purple-400/70" />
                                                                <span className="truncate">{aclass.name}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-gray-500 italic">No active classes</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-sm">
                                        <div className="text-blue-400 font-medium group-hover:underline">View Profile &rarr;</div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="text-xs font-semibold">Online</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
