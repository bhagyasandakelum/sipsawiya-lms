"use client"

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  GraduationCap, BookOpen, Video, Globe, ArrowRight, Users,
  Target, Lightbulb, Heart, Star, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'

/* ========================================
   Animated Counter Component
   ======================================== */
function AnimatedCounter({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, end])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-white/50 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}

/* ========================================
   Testimonial Data
   ======================================== */
const testimonials = [
  {
    quote: "Sipsawiya completely transformed how I study. The teachers are world-class and the materials are always organized perfectly.",
    name: "Kasun Perera",
    role: "A/L Student",
    avatar: "K",
  },
  {
    quote: "As a teacher, this platform gives me the tools to reach students beyond the classroom. Managing my classes has never been easier.",
    name: "Dr. Anoma Silva",
    role: "Physics Teacher",
    avatar: "A",
  },
  {
    quote: "The structured learning approach and quality content helped me score top marks in my examinations. Highly recommended!",
    name: "Nadeesha Fernando",
    role: "O/L Student",
    avatar: "N",
  },
  {
    quote: "I love the flexibility. I can learn at my own pace and revisit materials whenever I need to. The platform is beautifully designed too.",
    name: "Tharuka Bandara",
    role: "University Student",
    avatar: "T",
  },
]

/* ========================================
   Homepage Component
   ======================================== */
export default function Home() {
  const [featuredClasses, setFeaturedClasses] = useState<any[]>([])
  const [featuredTeachers, setFeaturedTeachers] = useState<any[]>([])
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalEnrollments: 0 })
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, teacherRes, statsRes] = await Promise.allSettled([
          api.get('/classes/featured'),
          api.get('/teachers/featured'),
          api.get('/stats/public'),
        ])
        if (classRes.status === 'fulfilled') setFeaturedClasses(classRes.value.data?.data || [])
        if (teacherRes.status === 'fulfilled') setFeaturedTeachers(teacherRes.value.data?.data || [])
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data || stats)
      } catch {
        // Silently handle – homepage should still render
      }
    }
    fetchData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      <Navbar />

      {/* ============================
          HERO SECTION
          ============================ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-8 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          The future of learning is here
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] text-white"
        >
          Master Your Future with <br />
          <span className="text-gradient">Sipsawiya LMS</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl text-base md:text-xl text-muted-foreground mb-12 leading-relaxed"
        >
          An open platform for independent learning. Empowering teachers and students worldwide
          to connect, share knowledge, and achieve excellence without organizational boundaries.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/register"
            className="group px-8 py-4 premium-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_8px_20px_rgba(59,130,246,0.3)]"
          >
            Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/classes"
            className="px-8 py-4 glass text-white rounded-xl font-bold hover:bg-white/10 transition-all shadow-sm text-center"
          >
            Explore Classes
          </Link>
        </motion.div>
      </section>

      {/* ============================
          VISION SECTION
          ============================ */}
      <section className="relative z-10 py-24 section-gradient-blue">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-6 uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                Our Vision
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Democratizing Quality Education for{' '}
                <span className="text-gradient">Everyone</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                We envision a world where every student has access to exceptional teachers and learning
                resources, regardless of location, background, or financial status. Sipsawiya bridges the
                gap between knowledge seekers and knowledge providers.
              </p>
              <p className="text-white/40 leading-relaxed">
                Through technology and human connection, we're building the largest independent learning
                community where potential knows no boundaries.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, label: 'Global Access', desc: 'Learn from anywhere, anytime', color: 'blue' },
                { icon: Users, label: 'Community', desc: 'Join thousands of learners', color: 'purple' },
                { icon: Lightbulb, label: 'Innovation', desc: 'Cutting-edge learning tools', color: 'cyan' },
                { icon: Heart, label: 'Passion', desc: 'Teachers who truly care', color: 'pink' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="glass rounded-2xl p-6 card-hover text-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-${item.color}-500/20 flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.label}</h3>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================
          MISSION SECTION
          ============================ */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-6 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5" />
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Three Pillars of <span className="text-gradient-purple">Excellence</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Our mission is built on three foundational pillars that drive everything we do.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="p-8 glass rounded-3xl card-hover">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Empower Teachers</h3>
              <p className="text-white/40 leading-relaxed">
                Give independent educators the tools they need to create, manage, and deliver
                world-class learning experiences to students everywhere.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 glass rounded-3xl card-hover">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Video className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Inspire Students</h3>
              <p className="text-white/40 leading-relaxed">
                Provide students with engaging, flexible, and high-quality learning resources
                that adapt to their pace and style of learning.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 glass rounded-3xl card-hover">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Break Barriers</h3>
              <p className="text-white/40 leading-relaxed">
                Remove geographical and institutional boundaries to create an inclusive
                learning ecosystem accessible to all.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================
          FEATURED CLASSES
          ============================ */}
      {featuredClasses.length > 0 && (
        <section className="relative z-10 py-24 section-gradient-purple">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  Popular Classes
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  Featured <span className="text-gradient">Classes</span>
                </h2>
              </div>
              <Link
                href="/classes"
                className="group flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All Classes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredClasses.slice(0, 6).map((cls, i) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={`/classes/${cls.id}`}
                    className="group block glass rounded-2xl overflow-hidden card-hover border border-white/5 hover:border-white/10"
                  >
                    <div className="h-44 bg-gradient-to-br from-blue-900/40 to-purple-900/40 relative overflow-hidden">
                      {cls.thumbnail ? (
                        <img src={cls.thumbnail} alt={cls.name} className="w-full h-full object-cover" />
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
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {cls.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                          {cls.teacher?.name?.[0] || 'T'}
                        </div>
                        <span>{cls.teacher?.name || 'Unknown Teacher'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/30 pt-3 border-t border-white/5">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {cls.enrollmentCount || 0} students
                        </span>
                        <span className="text-blue-400 font-medium group-hover:underline">View Details →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================
          FEATURED TEACHERS
          ============================ */}
      {featuredTeachers.length > 0 && (
        <section className="relative z-10 py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-4 uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Expert Educators
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  Meet Our <span className="text-gradient-purple">Teachers</span>
                </h2>
              </div>
              <Link
                href="/teachers"
                className="group flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                View All Teachers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTeachers.slice(0, 6).map((teacher, i) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={`/teachers/${teacher.id}`}
                    className="group block glass rounded-2xl p-6 card-hover border border-white/5 hover:border-white/10"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shrink-0">
                        {teacher.profilePicture ? (
                          <img src={teacher.profilePicture} alt={teacher.name} className="w-full h-full object-cover" />
                        ) : (
                          <GraduationCap className="w-8 h-8 text-blue-400/50" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {teacher.name}
                        </h3>
                        <p className="text-sm text-blue-400/70">{teacher.qualification || 'Expert Educator'}</p>
                      </div>
                    </div>
                    {teacher.specialization && (
                      <p className="text-xs text-white/40 mb-4 line-clamp-2">{teacher.specialization}</p>
                    )}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-xs text-white/30">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> {teacher.classCount} classes
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> {teacher.totalStudents} students
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================
          STATISTICS SECTION
          ============================ */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-12 md:p-16 border border-white/5"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
                Trusted by <span className="text-gradient">Thousands</span>
              </h2>
              <p className="text-white/40 text-sm">Our growing community of learners and educators</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCounter end={stats.totalStudents || 150} label="Students" suffix="+" />
              <AnimatedCounter end={stats.totalTeachers || 25} label="Teachers" suffix="+" />
              <AnimatedCounter end={stats.totalClasses || 50} label="Classes" suffix="+" />
              <AnimatedCounter end={stats.totalEnrollments || 500} label="Enrollments" suffix="+" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================
          TESTIMONIALS SECTION
          ============================ */}
      <section className="relative z-10 py-24 section-gradient-blue">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-semibold text-yellow-400 mb-6 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              What Our Community <span className="text-gradient">Says</span>
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass rounded-3xl p-8 md:p-12 text-center border border-white/5"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full premium-gradient flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[testimonialIndex].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">{testimonials[testimonialIndex].name}</div>
                    <div className="text-sm text-white/40">{testimonials[testimonialIndex].role}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Dots and Arrows */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={() => setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === testimonialIndex ? 'bg-blue-400 w-8' : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          CALL TO ACTION
          ============================ */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center"
          >
            {/* CTA Background */}
            <div className="absolute inset-0 premium-gradient opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
                Start Your Learning<br />Journey Today
              </h2>
              <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
                Join thousands of students and teachers on Sipsawiya. Create your free account
                and unlock access to world-class educational content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-2xl"
                >
                  Create Free Account <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/classes"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all text-center"
                >
                  Browse Classes
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
