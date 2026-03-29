"use client"

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, ArrowRight, ArrowLeft, BookOpen, Users } from 'lucide-react'

// Define the hierarchy: Categories -> Subjects -> Mock Classes/Teachers
const categories = [
    {
        id: 'scholarship-exam',
        name: 'Scholarship Exam',
        description: 'Foundation for primary academic excellence',
        color: 'from-amber-400 to-orange-500',
        subjects: ['Mathematics', 'Environmental Studies', 'Language']
    },
    {
        id: 'grade-6-9',
        name: 'Grade 6 to 9',
        description: 'Middle school comprehensive learning',
        color: 'from-green-400 to-emerald-600',
        subjects: ['Mathematics', 'Science', 'English', 'History']
    },
    {
        id: 'ol',
        name: 'O/L',
        description: 'Ordinary Level examination preparation',
        color: 'from-blue-400 to-indigo-600',
        subjects: ['Mathematics', 'Science', 'English', 'History', 'IT', 'Commerce']
    },
    {
        id: 'al',
        name: 'A/L',
        description: 'Advanced Level academic mastery',
        color: 'from-purple-400 to-violet-600',
        subjects: ['Combined Maths', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting']
    },
    {
        id: 'pre-university',
        name: 'Pre University',
        description: 'Bridging the gap to higher education',
        color: 'from-rose-400 to-red-600',
        subjects: ['Engineering Foundation', 'Medical Foundation', 'Business Prep']
    }
]

// Mock data for classes matching subject + teacher
const mockClassesForSubject = (subject: string) => [
    {
        id: `c1-${subject}`,
        name: `${subject} Masterclass`,
        teacherName: 'Dr. Sarah Connor',
        teacherImage: null,
        students: 120,
        rating: 4.8
    },
    {
        id: `c2-${subject}`,
        name: `${subject} Rapid Revision`,
        teacherName: 'Prof. John Smith',
        teacherImage: null,
        students: 85,
        rating: 4.6
    }
]

export default function ClassesPage() {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold tracking-tight">Sipsawiya</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/classes" className="text-white transition-colors">Classes</Link>
                    <Link href="/teachers" className="hover:text-white transition-colors">Teachers</Link>
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
                
                {/* Header Logic: Breadcrumbs & Titles */}
                <div className="mb-16">
                    {selectedCategory && (
                        <button 
                            onClick={() => {
                                if (selectedSubject) {
                                    setSelectedSubject(null)
                                } else {
                                    setSelectedCategory(null)
                                }
                            }}
                            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6 group text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to {selectedSubject ? selectedCategory.name : 'Categories'}
                        </button>
                    )}
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
                        {!selectedCategory ? (
                            <>Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Classes</span></>
                        ) : !selectedSubject ? (
                            <>{selectedCategory.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Subjects</span></>
                        ) : (
                            <>{selectedSubject} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Teachers</span></>
                        )}
                    </h1>
                    
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        {!selectedCategory 
                            ? "Select your current educational stage to find subjects and elite educators tailored to your syllabus."
                            : !selectedSubject
                            ? `Choose a subject in the ${selectedCategory.name} curriculum to view available classes.`
                            : `Discover top classes and expert educators specializing in ${selectedSubject} for ${selectedCategory.name}.`
                        }
                    </p>
                </div>

                {/* Step 1: Categories */}
                {!selectedCategory && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div 
                                key={category.id}
                                onClick={() => setSelectedCategory(category)}
                                className="group relative rounded-3xl p-[1px] cursor-pointer hover:scale-[1.02] transition-transform duration-300 overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                                <div className="relative h-full bg-[#111] rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
                                    <div>
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-lg`}>
                                            <BookOpen className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 text-white">{category.name}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{category.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm pt-6 border-t border-white/5">
                                        <span className="text-gray-400">{category.subjects.length} Subjects available</span>
                                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 2: Subjects */}
                {selectedCategory && !selectedSubject && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedCategory.subjects.map((subject: string) => (
                            <div 
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className="group bg-[#111] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 cursor-pointer hover:bg-white-[0.02] transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                            >
                                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{subject}</h3>
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>View Teachers related</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 3: Classes / Teachers */}
                {selectedSubject && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {mockClassesForSubject(selectedSubject).map((cls) => (
                            <Link 
                                href="/dashboard/classes" // Or wherever actual class link is
                                key={cls.id}
                                className="group flex flex-col sm:flex-row gap-6 bg-[#0f0f0f] border border-whtie/5 hover:border-white/10 p-6 rounded-3xl hover:bg-white/5 transition-all"
                            >
                                <div className="w-full sm:w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/5 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-12 h-12 text-blue-400/50" />
                                </div>
                                <div className="flex flex-col justify-between flex-1">
                                    <div>
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold mb-3 inline-block">
                                            {selectedSubject}
                                        </span>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all">
                                            {cls.name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                                <GraduationCap className="w-3 h-3 text-white/70" />
                                            </div>
                                            <span className="font-medium text-gray-300">{cls.teacherName}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            <span>{cls.students} Students</span>
                                        </div>
                                        <div className="text-blue-400 font-medium hover:underline flex items-center gap-1">
                                            Enroll Now <ArrowRight className="w-3 h-3" />
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
