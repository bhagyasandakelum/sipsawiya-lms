"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen, Users, Clock, ArrowLeft, ArrowRight, Loader2,
  FileText, Video, File, ChevronDown, ChevronUp, GraduationCap,
  Calendar, BarChart3
} from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'

const materialTypeIcons: Record<string, any> = {
  pdf: FileText,
  video: Video,
  youtube: Video,
  document: FileText,
  default: File,
}

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params?.classId as string
  const { isAuthenticated, user } = useAuth()

  const [classData, setClassData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!classId) return
    const fetchClass = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/classes/${classId}`)
        if (res.data?.success) {
          setClassData(res.data.data)
        }
      } catch {
        setClassData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchClass()
  }, [classId])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/classes/${classId}`)
      return
    }
    setEnrolling(true)
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
      setEnrolling(false)
    }
  }

  const toggleSection = (title: string) => {
    const next = new Set(expandedSections)
    if (next.has(title)) {
      next.delete(title)
    } else {
      next.add(title)
    }
    setExpandedSections(next)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p>Loading class details...</p>
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <BookOpen className="w-16 h-16 text-white/10 mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Class Not Found</h1>
          <p className="text-white/40 mb-8">The class you're looking for doesn't exist or has been removed.</p>
          <Link href="/classes" className="flex items-center gap-2 text-blue-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Classes
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/classes" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Classes
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Thumbnail */}
              <div className="h-56 md:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/40 to-purple-900/40 relative mb-6">
                {classData.thumbnail ? (
                  <img src={classData.thumbnail} alt={classData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-white/10" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {classData.category && (
                    <span className="px-3 py-1.5 bg-blue-500/80 text-white rounded-lg text-xs font-bold uppercase backdrop-blur-sm">
                      {classData.category}
                    </span>
                  )}
                  {classData.difficulty && (
                    <span className="px-3 py-1.5 bg-purple-500/80 text-white rounded-lg text-xs font-bold uppercase backdrop-blur-sm">
                      {classData.difficulty}
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
                {classData.name}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-6">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  {classData.enrollmentCount} students enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  {classData.materialCount} materials
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  {classData.sections?.length || 0} sections
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  {new Date(classData.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-6 md:p-8 border border-white/5"
            >
              <h2 className="text-xl font-bold text-white mb-4">About This Class</h2>
              <p className="text-white/50 leading-relaxed whitespace-pre-wrap">
                {classData.description || 'No description provided for this class.'}
              </p>
            </motion.div>

            {/* Sections Preview */}
            {classData.sections && classData.sections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="glass rounded-2xl border border-white/5 overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-white/5">
                  <h2 className="text-xl font-bold text-white">Course Content</h2>
                  <p className="text-sm text-white/40 mt-1">
                    {classData.sections.length} sections • {classData.materialCount} materials
                  </p>
                </div>
                <div className="divide-y divide-white/5">
                  {classData.sections.map((section: any) => (
                    <div key={section.title}>
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="w-full px-6 md:px-8 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white">{section.title}</span>
                            <span className="text-xs text-white/30 ml-2">
                              ({section.materialCount} {section.materialCount === 1 ? 'material' : 'materials'})
                            </span>
                          </div>
                        </div>
                        {expandedSections.has(section.title) ? (
                          <ChevronUp className="w-4 h-4 text-white/30" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/30" />
                        )}
                      </button>
                      {expandedSections.has(section.title) && (
                        <div className="px-6 md:px-8 pb-4 space-y-2">
                          {section.materials.map((mat: any) => {
                            const Icon = materialTypeIcons[mat.type?.toLowerCase()] || materialTypeIcons.default
                            return (
                              <div
                                key={mat.id}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm"
                              >
                                <Icon className="w-4 h-4 text-white/30 flex-shrink-0" />
                                <span className="text-white/50">{mat.title}</span>
                                <span className="ml-auto text-[10px] text-white/20 uppercase font-medium">{mat.type}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enroll Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="glass rounded-2xl p-6 border border-white/5 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-extrabold text-white mb-1">Free</div>
                <p className="text-xs text-white/30">Open enrollment</p>
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-4 premium-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 mb-4"
              >
                {enrolling ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : !isAuthenticated ? (
                  <>Login to Enroll <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Enroll Now <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-white/40">
                  <span>Students enrolled</span>
                  <span className="font-medium text-white">{classData.enrollmentCount}</span>
                </div>
                <div className="flex items-center justify-between text-white/40">
                  <span>Total materials</span>
                  <span className="font-medium text-white">{classData.materialCount}</span>
                </div>
                <div className="flex items-center justify-between text-white/40">
                  <span>Sections</span>
                  <span className="font-medium text-white">{classData.sections?.length || 0}</span>
                </div>
                {classData.difficulty && (
                  <div className="flex items-center justify-between text-white/40">
                    <span>Difficulty</span>
                    <span className="font-medium text-white">{classData.difficulty}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Teacher Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <Link
                href={`/teachers/${classData.teacher.id}`}
                className="block glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shrink-0">
                    {classData.teacher.profilePicture ? (
                      <img
                        src={classData.teacher.profilePicture}
                        alt={classData.teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GraduationCap className="w-7 h-7 text-blue-400/50" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-1">Instructor</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {classData.teacher.name}
                    </h3>
                  </div>
                </div>
                {classData.teacher.qualification && (
                  <p className="text-sm text-white/40 mb-2">{classData.teacher.qualification}</p>
                )}
                {classData.teacher.specialization && (
                  <p className="text-xs text-white/30 mb-4">{classData.teacher.specialization}</p>
                )}
                <span className="text-xs text-blue-400 font-medium group-hover:underline">
                  View Profile →
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
