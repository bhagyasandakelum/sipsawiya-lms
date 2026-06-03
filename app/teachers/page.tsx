"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  GraduationCap, BookOpen, Search, Loader2, Users,
  ChevronLeft, ChevronRight, SlidersHorizontal, X
} from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [specializations, setSpecializations] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Fetch specialization filter options
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get('/teachers/specializations')
        if (res.data?.success) {
          setSpecializations(res.data.data || [])
        }
      } catch { /* optional */ }
    }
    fetchSpecializations()
  }, [])

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 12 }
      if (searchQuery) params.search = searchQuery
      if (specialization) params.specialization = specialization

      const res = await api.get('/teachers', { params })
      if (res.data?.success) {
        setTeachers(res.data.data.teachers || [])
        setTotalPages(res.data.data.totalPages || 1)
        setTotal(res.data.data.total || 0)
      }
    } catch {
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, specialization, page])

  useEffect(() => {
    const timer = setTimeout(fetchTeachers, 300)
    return () => clearTimeout(timer)
  }, [fetchTeachers])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, specialization])

  const clearFilters = () => {
    setSearchQuery("")
    setSpecialization("")
  }

  const hasActiveFilters = searchQuery || specialization

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-10"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              Elite Faculty
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 leading-tight text-white">
              Meet Our <br />
              <span className="text-gradient-purple">Expert Educators</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Learn from the best minds in the industry. Our teachers are dedicated to your success and academic excellence.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="teacher-search"
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialization(specialization === spec ? "" : spec!)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                specialization === spec
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-white/40 border border-white/5 hover:text-white/70'
              }`}
            >
              {spec}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400/70 hover:text-red-400 bg-red-500/10 border border-red-500/10 transition-all"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}

          <div className="ml-auto text-xs text-white/30">
            {total} {total === 1 ? 'teacher' : 'teachers'} found
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p>Loading teachers...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-white/5">
            <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No teachers found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-blue-400 hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher, i) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={`/teachers/${teacher.id}`}
                    className="group relative block rounded-2xl p-[1px] overflow-hidden card-hover"
                  >
                    {/* Gradient border on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-colors duration-500" />

                    <div className="relative h-full bg-[#0d0d0d] rounded-2xl p-6 flex flex-col">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:border-blue-400/50 transition-colors shrink-0">
                          {teacher.profilePicture ? (
                            <img src={teacher.profilePicture} alt={teacher.name} className="w-full h-full object-cover" />
                          ) : (
                            <GraduationCap className="w-8 h-8 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {teacher.name}
                          </h3>
                          <p className="text-blue-400/70 text-sm font-medium">
                            {teacher.qualification || 'Expert Educator'}
                          </p>
                        </div>
                      </div>

                      {teacher.specialization && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Specialization</p>
                          <p className="text-sm text-white/50 line-clamp-2">{teacher.specialization}</p>
                        </div>
                      )}

                      {teacher.bio && (
                        <p className="text-sm text-white/30 line-clamp-2 mb-4 flex-1">{teacher.bio}</p>
                      )}

                      <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-white/30">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> {teacher.classCount} classes
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> {teacher.totalStudents} students
                          </span>
                        </div>
                        <span className="text-blue-400 font-medium group-hover:underline">View →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 7) {
                    pageNum = i + 1
                  } else if (page <= 4) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i
                  } else {
                    pageNum = page - 3 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'glass text-white/40 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
