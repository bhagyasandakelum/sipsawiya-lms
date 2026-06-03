"use client"

import Link from 'next/link'
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react'

const platformLinks = [
  { href: '/classes', label: 'Explore Classes' },
  { href: '/teachers', label: 'Our Teachers' },
  { href: '/about', label: 'About Us' },
  { href: '/faq', label: 'FAQ' },
]

const resourceLinks = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/register', label: 'Get Started' },
  { href: '/login', label: 'Student Login' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient glow behind footer */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-blue-600/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Sipsawiya</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Empowering teachers and students worldwide to connect, share knowledge, and achieve academic excellence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" /></svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-white/40">
                <Mail className="w-4 h-4 text-blue-400/60 flex-shrink-0" />
                <span>info@sipsawiya.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/40">
                <Phone className="w-4 h-4 text-blue-400/60 flex-shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/40">
                <MapPin className="w-4 h-4 text-blue-400/60 flex-shrink-0 mt-0.5" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Sipsawiya LMS. Precision Crafted for Excellence.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="#" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
