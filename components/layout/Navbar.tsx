"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const navLinks = [
  { href: '/classes', label: 'Classes' },
  { href: '/teachers', label: 'Teachers' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-50 flex items-center justify-between px-6 md:px-8 py-5 max-w-7xl mx-auto"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-shadow">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Sipsawiya</span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-3">
        {isLoading ? (
          <div className="w-24 h-10 rounded-full bg-white/5 animate-pulse" />
        ) : isAuthenticated ? (
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/40"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 premium-gradient text-white rounded-full text-sm font-bold hover:scale-105 transition-all shadow-md shadow-blue-600/20"
            >
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white/70 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 p-4 glass rounded-2xl border border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold text-center hover:bg-blue-500 transition-all"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-sm font-medium text-white/70 hover:text-white transition-colors text-center"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 premium-gradient text-white rounded-xl text-sm font-bold text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
