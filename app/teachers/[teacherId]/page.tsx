import Link from 'next/link'
import { GraduationCap, BookOpen, Clock, Users, ArrowLeft, Bell, Calendar, UserCheck } from 'lucide-react'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import EnrollmentButton from './enrollment-button'

interface TeacherDetailPageProps {
    params: {
        teacherId: string
    }
}

export default async function TeacherDetailPage({ params }: TeacherDetailPageProps) {
    const session = await getServerSession(authOptions as any)
    const teacherId = params.teacherId

    const teacher = await prisma.user.findUnique({
        where: { id: teacherId },
        include: {
            taughtClasses: {
                include: {
                    enrollments: true,
                    _count: {
                        select: { materials: true }
                    }
                }
            },
            notices: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })

    if (!teacher || teacher.role !== 'TEACHER') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Teacher not found</h1>
                    <Link href="/teachers" className="text-blue-400 hover:underline">Back to Teachers</Link>
                </div>
            </div>
        )
    }

    const isStudent = (session as any)?.user?.role === 'STUDENT'
    const isLoggedIn = !!session

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white">
            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold tracking-tight">Sipsawiya</span>
                </Link>
                <Link href="/teachers" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to Teachers
                </Link>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar: Teacher Profile */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass rounded-3xl p-8 sticky top-24 border border-white/5">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 mb-6 shadow-2xl">
                                    {teacher.image ? (
                                        <img src={teacher.image} alt={teacher.name || ''} className="w-full h-full object-cover" />
                                    ) : (
                                        <GraduationCap className="w-16 h-16 text-blue-400" />
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold mb-2">{teacher.name}</h1>
                                <p className="text-blue-400 font-medium mb-4">{teacher.degree || 'Expert Educator'}</p>
                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                    {(teacher.subjects?.split(',') || []).map((subject: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/5">
                                            {subject.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span className="font-medium">{new Date(teacher.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Total Classes</span>
                                    <span className="font-medium">{teacher.taughtClasses.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {!isLoggedIn && (
                            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <UserCheck />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Sign in to enroll</h3>
                                        <p className="text-sm text-muted-foreground">You need a student account to enroll in these classes.</p>
                                    </div>
                                </div>
                                <Link href="/login" className="px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-bold hover:bg-blue-500 transition-all whitespace-nowrap">
                                    Sign In
                                </Link>
                            </div>
                        )}

                        {isLoggedIn && !isStudent && teacher.id !== (session as any).user.id && (
                            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
                                <Bell className="text-amber-500" />
                                <p className="text-sm font-medium">Only student accounts can enroll in classes.</p>
                            </div>
                        )}

                        {/* Special Notices */}
                        {teacher.notices.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/10">
                                        <Bell size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight">Teacher Notices</h2>
                                </div>
                                <div className="space-y-4">
                                    {teacher.notices.map((notice: any) => (
                                        <div key={notice.id} className="glass p-6 rounded-2xl border-l-4 border-l-purple-500">
                                            <div className="flex items-center justify-between mb-3 text-sm">
                                                <span className="flex items-center gap-2 text-purple-400 font-medium">
                                                    <Calendar size={14} />
                                                    {new Date(notice.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {notice.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Classes Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/10">
                                    <BookOpen size={20} />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Classes Conducted</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {teacher.taughtClasses.map((cls: any) => (
                                    <div key={cls.id} className="glass rounded-3xl overflow-hidden hover:bg-white/5 transition-all group border border-white/5">
                                        <div className="h-40 premium-gradient relative">
                                            <div className="absolute inset-0 bg-black/20" />
                                            {cls.thumbnail ? (
                                                <img src={cls.thumbnail} alt={cls.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="text-white/20 w-16 h-16" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{cls.name}</h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-6 min-h-[40px]">
                                                {cls.description || "No description provided for this class."}
                                            </p>

                                            <div className="flex items-center gap-6 mb-8 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Users size={14} className="text-blue-400" />
                                                    <span>{cls.enrollments.length} Students</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-purple-400" />
                                                    <span>Ongoing</span>
                                                </div>
                                            </div>

                                            <EnrollmentButton
                                                classId={cls.id}
                                                isStudent={isStudent}
                                                isLoggedIn={isLoggedIn}
                                                alreadyEnrolled={cls.enrollments.some((e: any) => e.studentId === (session as any)?.user?.id)}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {teacher.taughtClasses.length === 0 && (
                                    <div className="col-span-full py-12 text-center glass rounded-3xl border-dashed border-white/10 opacity-50">
                                        <p className="text-muted-foreground">This teacher hasn't created any classes yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
