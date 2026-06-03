"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  GraduationCap, BookOpen, Users, ArrowLeft, ArrowRight,
  Loader2, Clock, Calendar, Bell, UserCheck, Briefcase, Award
} from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'

export default function TeacherDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teacherId = params?.teacherId as string
  const { isAuthenticated, user } = useAuth()

  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    if (!teacherId) return
    const fetchTeacher = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/teachers/${teacherId}`)
        if (res.data?.success) {
          setTeacher(res.data.data)
        }
      } catch {
        setTeacher(null)
      } finally {
        setLoading(false)
      }
    }
    fetchTeacher()
  }, [teacherId])

  const handleEnroll = async (classId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/teachers/${teacherId}`)
      return
    }
    setEnrolling(classId)
    try {
      await api.post('/enrollments', { classId })
      router.push(`/dashboard/classes/${classId}`)
    } catch (err: any) {
      const message = err.response?.data?.message || ''
      if (message.includes('already enrolled') || message.includes('Already enrolled')) {
        router.push(`/dashboard/classes/${classId}`)
      } else {
        alert(message || 'Failed to enroll')
      }
    } finally {
      setEnrolling(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p>Loading teacher profile...</p>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <GraduationCap className="w-16 h-16 text-white/10 mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Teacher Not Found</h1>
          <p className="text-white/40 mb-8">The teacher profile you're looking for doesn't exist.</p>
          <Link href="/teachers" className="flex items-center gap-2 text-blue-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Teachers
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const isStudent = user?.role === 'STUDENT'

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-8">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/teachers" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Teachers
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Sidebar: Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-3xl p-8 border border-white/5 sticky top-24">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-white/10 mb-6 shadow-2xl">
                  {teacher.profilePicture ? (
                    <img src={teacher.profilePicture} alt={teacher.name} className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-14 h-14 text-blue-400" />
                  )}
                </div>

                <h1 className="text-2xl font-bold text-white mb-1">{teacher.name}</h1>
                <p className="text-blue-400 font-medium text-sm mb-6">
                  {teacher.qualification || 'Expert Educator'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-white">{teacher.classCount}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">Classes</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-white">{teacher.totalStudents}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">Students</div>
                  </div>
                </div>

                {/* Details */}
                <div className="w-full space-y-3 pt-6 border-t border-white/5 text-left">
                  {teacher.experience && (
                    <div className="flex items-start gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-purple-400/60 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Experience</p>
                        <p className="text-white/60">{teacher.experience}</p>
                      </div>
                    </div>
                  )}
                  {teacher.specialization && (
                    <div className="flex items-start gap-3 text-sm">
                      <Award className="w-4 h-4 text-emerald-400/60 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Specialization</p>
                        <p className="text-white/60">{teacher.specialization}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-orange-400/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Member Since</p>
                      <p className="text-white/60">{new Date(teacher.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Bio */}
            {teacher.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 md:p-8 border border-white/5"
              >
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <p className="text-white/50 leading-relaxed whitespace-pre-wrap">{teacher.bio}</p>
              </motion.div>
            )}

            {/* Login prompt for non-authenticated */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <UserCheck />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Sign in to enroll</h3>
                    <p className="text-sm text-white/40">You need an account to enroll in classes.</p>
                  </div>
                </div>
                <Link
                  href={`/login?redirect=/teachers/${teacherId}`}
                  className="px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-500 transition-all whitespace-nowrap"
                >
                  Sign In
                </Link>
              </motion.div>
            )}

            {/* Notices */}
            {teacher.notices && teacher.notices.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/10">
                    <Bell size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Recent Notices</h2>
                </div>
                {teacher.notices.map((notice: any) => (
                  <div key={notice.id} className="glass p-5 rounded-2xl border-l-4 border-l-purple-500 border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-purple-400 font-medium mb-2">
                      <Calendar size={12} />
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{notice.content}</p>
                  </div>
                ))}
              </motion.section>
            )}

            {/* Classes */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/10">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Classes ({teacher.classes?.length || 0})</h2>
              </div>

              {teacher.classes && teacher.classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teacher.classes.map((cls: any) => (
                    <div
                      key={cls.id}
                      className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <Link href={`/classes/${cls.id}`}>
                        <div className="h-36 premium-gradient relative">
                          {cls.thumbnail ? (
                            <img src={cls.thumbnail} alt={cls.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="text-white/20 w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {cls.category && (
                              <span className="px-2 py-1 bg-blue-500/80 text-white rounded-md text-[10px] font-bold uppercase backdrop-blur-sm">
                                {cls.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                      <div className="p-5">
                        <Link href={`/classes/${cls.id}`}>
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                            {cls.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-white/30 line-clamp-2 mb-4 min-h-[40px]">
                          {cls.description || 'No description provided.'}
                        </p>

                        <div className="flex items-center gap-4 mb-4 text-xs text-white/30">
                          <span className="flex items-center gap-1.5">
                            <Users size={14} className="text-blue-400/60" />
                            {cls.enrollmentCount} students
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={14} className="text-purple-400/60" />
                            {cls.materialCount} materials
                          </span>
                        </div>

                        {isAuthenticated && isStudent ? (
                          <button
                            onClick={() => handleEnroll(cls.id)}
                            disabled={enrolling === cls.id}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                          >
                            {enrolling === cls.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>Enroll Now <ArrowRight className="w-4 h-4" /></>
                            )}
                          </button>
                        ) : (
                          <Link
                            href={`/classes/${cls.id}`}
                            className="w-full py-2.5 glass text-white/60 hover:text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                          >
                            View Details <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center glass rounded-2xl border-dashed border-white/10">
                  <p className="text-white/30">This teacher hasn't created any classes yet.</p>
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
