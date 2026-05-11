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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold tracking-tight text-white">Sipsawiya</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/classes" className="hover:text-white transition-colors">Classes</Link>
          <Link href="/teachers" className="hover:text-white transition-colors">Teachers</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-white transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-blue-400 transition-colors">Login</Link>
          <Link href="/classes" className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20">
            Start Learning
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          The future of learning is here
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] text-white"
        >
          Master Your Future with <br />
          <span className="text-gradient">Sipsawiya LMS</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed"
        >
          An open platform for independent learning. Empowering teachers and students worldwide to connect, share knowledge, and achieve excellence without organizational boundaries.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/register" className="group px-8 py-4 premium-gradient text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_8px_20px_rgba(59,130,246,0.3)]">
            Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/classes" className="px-8 py-4 glass text-white rounded-xl font-bold hover:bg-white/10 transition-all shadow-sm">
            Explore Classes
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full"
        >
          <motion.div variants={itemVariants} className="p-8 glass rounded-3xl text-left flex flex-col gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Interactive Materials</h3>
            <p className="text-muted-foreground">Upload and access lecture notes, PDFs, and rich media content with ease.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 glass rounded-3xl text-left flex flex-col gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Video className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Video Lessons</h3>
            <p className="text-muted-foreground">Integrated YouTube player for seamless video learning directly on the platform.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 glass rounded-3xl text-left flex flex-col gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Globe className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Flexible Enrollment</h3>
            <p className="text-muted-foreground">Students can enroll in multiple classes and track their progress efficiently.</p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="relative border-t border-white/5 py-12 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Sipsawiya LMS. Precision Crafted for Excellence.
      </footer>
    </div>
  )
}
