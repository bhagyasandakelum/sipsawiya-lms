"use client"

import { useState, useEffect, useRef } from 'react'
import {
  GraduationCap, Target, Lightbulb, Heart, Globe, Users,
  BookOpen, Award, Shield, Zap
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'

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
      <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-white/40 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}

const values = [
  { icon: Heart, title: 'Student-First', desc: 'Every decision we make puts student success at the forefront.', color: 'pink' },
  { icon: Shield, title: 'Trust & Quality', desc: 'We maintain the highest standards of educational content.', color: 'blue' },
  { icon: Globe, title: 'Accessibility', desc: 'Education without boundaries — available to everyone, everywhere.', color: 'emerald' },
  { icon: Zap, title: 'Innovation', desc: 'Continuously evolving our platform with cutting-edge technology.', color: 'yellow' },
  { icon: Users, title: 'Community', desc: 'Building lasting connections between teachers and students.', color: 'purple' },
  { icon: Award, title: 'Excellence', desc: 'Striving for nothing less than exceptional in everything we do.', color: 'orange' },
]

export default function AboutPage() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalEnrollments: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/public')
        if (res.data?.success) setStats(res.data.data)
      } catch { /* use defaults */ }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6">
            <GraduationCap className="w-3.5 h-3.5" />
            About Sipsawiya
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-white leading-tight">
            Empowering Minds,<br />
            <span className="text-gradient">Transforming Futures</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/50 leading-relaxed">
            Sipsawiya is Sri Lanka's premier independent learning management system, built to connect
            passionate educators with eager learners across the nation and beyond.
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="relative z-10 py-20 section-gradient-blue">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>
                  Sipsawiya was born from a simple yet powerful idea: every student deserves access to
                  excellent education, and every teacher deserves a platform to share their expertise freely.
                </p>
                <p>
                  Founded in Sri Lanka, we recognized that talented educators often lack the tools and
                  reach to connect with students beyond traditional classroom walls. Simultaneously,
                  students struggle to find quality tutors and structured learning materials.
                </p>
                <p>
                  Our platform bridges this gap by providing a beautiful, intuitive space where teachers
                  can create classes, upload materials, and manage students — while learners can discover,
                  enroll, and grow at their own pace.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-8 border border-white/5"
            >
              <div className="grid grid-cols-2 gap-6">
                <AnimatedCounter end={stats.totalStudents || 150} label="Students" suffix="+" />
                <AnimatedCounter end={stats.totalTeachers || 25} label="Teachers" suffix="+" />
                <AnimatedCounter end={stats.totalClasses || 50} label="Classes" suffix="+" />
                <AnimatedCounter end={stats.totalEnrollments || 500} label="Enrollments" suffix="+" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 md:p-10 border border-white/5"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-white/50 leading-relaxed">
              To become the leading independent education platform in South Asia, democratizing access
              to quality learning and creating a world where knowledge flows freely between passionate
              educators and motivated learners, regardless of geographical or institutional boundaries.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass rounded-3xl p-8 md:p-10 border border-white/5"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-white/50 leading-relaxed">
              To empower independent teachers with world-class tools for creating and managing courses,
              while providing students an intuitive, engaging, and affordable platform to discover and
              excel in their academic journeys through structured, high-quality content.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-10 py-20 section-gradient-purple">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Our Core Values</h2>
            <p className="text-white/40 max-w-xl mx-auto">The principles that guide every decision we make.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="glass rounded-2xl p-6 card-hover border border-white/5"
              >
                <div className={`w-12 h-12 rounded-xl bg-${value.color}-500/20 flex items-center justify-center mb-4`}>
                  <value.icon className={`w-6 h-6 text-${value.color}-400`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
