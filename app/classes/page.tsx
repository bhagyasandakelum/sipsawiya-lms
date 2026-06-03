"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen, Users, Search, Loader2, Filter, ChevronLeft, ChevronRight,
  ArrowRight, SlidersHorizontal, X
} from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await api.get('/classes/filters')
        if (res.data?.success) {
          setCategories(res.data.data.categories || [])
          setDifficulties(res.data.data.difficulties || [])
        }
      } catch {
        // Filters may not be available yet
      }
    }
    fetchFilters()
  }, [])

  // Fetch classes with debounced search
  const fetchClasses = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 12 }
      if (searchQuery) params.search = searchQuery
      if (category) params.category = category
      if (difficulty) params.difficulty = difficulty

      const res = await api.get('/classes', { params })
      if (res.data?.success) {
        setClasses(res.data.data.classes || [])
        setTotalPages(res.data.data.totalPages || 1)
        setTotal(res.data.data.total || 0)
      }
    } catch {
      setClasses([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, category, difficulty, page])

  useEffect(() => {
    const timer = setTimeout(fetchClasses, 300)
    return () => clearTimeout(timer)
  }, [fetchClasses])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, category, difficulty])

  const handleEnroll = async (classId: string) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/classes")
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

  const clearFilters = () => {
    setSearchQuery("")
    setCategory("")
    setDifficulty("")
  }

  const hasActiveFilters = searchQuery || category || difficulty

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-white">
            Explore <span className="text-gradient-purple">Classes</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8">
            Discover top classes from expert educators. Find your next subject and start learning today.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="class-search"
              type="text"
              className="block w-full pl-12 pr-4 py-4 glass text-white rounded-2xl border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-muted-foreground/50 shadow-lg"
              placeholder="Search by class name, description, or teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              showFilters ? 'bg-blue-600 text-white' : 'glass text-white/60 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>

          {/* Category quick filters */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? "" : cat!)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-white/40 border border-white/5 hover:text-white/70'
              }`}
            >
              {cat}
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
            {total} {total === 1 ? 'class' : 'classes'} found
          </div>
        </motion.div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat!}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">All Levels</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff!}>{diff}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p>Loading classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-white/5">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No classes found</h3>
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
              {classes.map((cls, i) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="group glass rounded-2xl overflow-hidden card-hover border border-white/5 hover:border-white/10 flex flex-col"
                >
                  {/* Thumbnail */}
                  <Link href={`/classes/${cls.id}`} className="block">
                    <div className="h-44 bg-gradient-to-br from-blue-900/40 to-purple-900/40 relative overflow-hidden">
                      {cls.thumbnail ? (
                        <img src={cls.thumbnail} alt={cls.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white/10" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {cls.category && (
                          <span className="px-2.5 py-1 bg-blue-500/80 text-white rounded-lg text-[10px] font-bold uppercase backdrop-blur-sm">
                            {cls.category}
                          </span>
                        )}
                        {cls.difficulty && (
                          <span className="px-2.5 py-1 bg-purple-500/80 text-white rounded-lg text-[10px] font-bold uppercase backdrop-blur-sm">
                            {cls.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={`/classes/${cls.id}`}>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {cls.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-white/30 line-clamp-2 mb-4 flex-1">
                      {cls.description || 'No description available'}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                        {cls.teacher?.name?.[0] || 'T'}
                      </div>
                      <span className="truncate">{cls.teacher?.name || 'Unknown Teacher'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="flex items-center gap-1.5 text-xs text-white/30">
                        <Users className="w-3.5 h-3.5" /> {cls.enrollmentCount || 0} students
                      </span>
                      <button
                        onClick={() => handleEnroll(cls.id)}
                        disabled={enrolling === cls.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {enrolling === cls.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>Enroll <ArrowRight className="w-3 h-3" /></>
                        )}
                      </button>
                    </div>
                  </div>
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
