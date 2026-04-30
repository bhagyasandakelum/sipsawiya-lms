"use client"

import Link from 'next/link'
import { GraduationCap, BookOpen, Video, Globe, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-400/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold tracking-tight text-blue-950">Sipsawiya</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/classes" className="hover:text-blue-600 transition-colors">Classes</Link>
          <Link href="/teachers" className="hover:text-blue-600 transition-colors">Teachers</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-blue-900 hover:text-blue-600 transition-colors">Login</Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
            Open Dashboard
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700 mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          The future of learning is here
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] text-blue-950"
        >
          Master Your Future with <br />
          <span className="text-gradient">Sipsawiya LMS</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl text-lg md:text-xl text-slate-600 mb-12 leading-relaxed"
        >
          The ultimate platform for tuition centers. Empowering teachers to share knowledge and students to achieve excellence through a seamless learning experience.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard" className="group px-8 py-4 premium-gradient text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)]">
            Explore Dashboard <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard/profile" className="px-8 py-4 bg-white border border-blue-100 text-blue-900 rounded-xl font-bold hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
            Teacher Settings
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full"
        >
          <motion.div variants={itemVariants} className="p-8 glass rounded-3xl text-left flex flex-col gap-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-950">Interactive Materials</h3>
            <p className="text-slate-600">Upload and access lecture notes, PDFs, and rich media content with ease.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 glass rounded-3xl text-left flex flex-col gap-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center">
              <Video className="text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-950">Video Lessons</h3>
            <p className="text-slate-600">Integrated YouTube player for seamless video learning directly on the platform.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 glass rounded-3xl text-left flex flex-col gap-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Globe className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-950">Flexible Enrollment</h3>
            <p className="text-slate-600">Students can enroll in multiple classes and track their progress efficiently.</p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="relative border-t border-blue-100 bg-white/50 py-12 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Sipsawiya LMS. Precision Crafted for Excellence.
      </footer>
    </div>
  )
}
