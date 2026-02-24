import Link from 'next/link'
import { GraduationCap, BookOpen, Video, Globe, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold tracking-tight">Sipsawiya</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
          <Link href="/teachers" className="hover:text-white transition-colors">Teachers</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-white transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-white transition-colors">Login</Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-all">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          The future of learning is here
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
          Master Your Future with <br />
          <span className="text-gradient">Sipsawiya LMS</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
          The ultimate platform for tuition centers. Empowing teachers to share knowledge and students to achieve excellence through a seamless learning experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="group px-8 py-4 premium-gradient rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            Explore Dashboard <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard/profile" className="px-8 py-4 glass rounded-xl font-bold hover:bg-white/10 transition-all">
            Teacher Settings
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          <div className="p-8 glass rounded-3xl text-left flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Interactive Materials</h3>
            <p className="text-muted-foreground">Upload and access lecture notes, PDFs, and rich media content with ease.</p>
          </div>

          <div className="p-8 glass rounded-3xl text-left flex flex-col gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Video className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold">Video Lessons</h3>
            <p className="text-muted-foreground">Integrated YouTube player for seamless video learning directly on the platform.</p>
          </div>

          <div className="p-8 glass rounded-3xl text-left flex flex-col gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Globe className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Flexible Enrollment</h3>
            <p className="text-muted-foreground">Students can enroll in multiple classes and track their progress efficiently.</p>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="relative border-t border-white/5 py-12 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Sipsawiya LMS. Precision Crafted for Excellence.
      </div>
    </div>
  )
}
