"use client"

import { useState } from 'react'
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // UI-only for now
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info@sipsawiya.com', href: 'mailto:info@sipsawiya.com' },
    { icon: Phone, label: 'Phone', value: '+94 11 234 5678', href: 'tel:+94112345678' },
    { icon: MapPin, label: 'Location', value: 'Colombo, Sri Lanka', href: '#' },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      {/* Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6">
            <MessageSquare className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-white">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/50">
            Have a question or feedback? We'd love to hear from you. Reach out and we'll get back to you as soon as possible.
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="block glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-0.5">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="glass rounded-2xl p-6 border border-white/5"
            >
              <h3 className="text-sm font-bold text-white mb-3">Office Hours</h3>
              <div className="space-y-2 text-sm text-white/40">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-white/60">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white/60">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white/60">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-3xl p-8 md:p-10 border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  ✓ Thank you for your message! We'll get back to you shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-white/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-white/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="" className="bg-gray-900">Select a subject</option>
                    <option value="general" className="bg-gray-900">General Inquiry</option>
                    <option value="support" className="bg-gray-900">Technical Support</option>
                    <option value="teacher" className="bg-gray-900">Become a Teacher</option>
                    <option value="partnership" className="bg-gray-900">Partnership</option>
                    <option value="feedback" className="bg-gray-900">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 block">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none placeholder:text-white/20"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 premium-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-blue-600/20"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
