"use client"

import { useState } from 'react'
import { Search, ChevronDown, HelpCircle, BookOpen, Users, Settings, UserPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  icon: any
  color: string
  items: FAQItem[]
}

const faqCategories: FAQCategory[] = [
  {
    title: 'Getting Started',
    icon: UserPlus,
    color: 'blue',
    items: [
      {
        question: 'How do I create an account on Sipsawiya?',
        answer:
          'Creating an account is simple! Click the "Get Started" button on the homepage, fill in your details including name, email, and password, then choose your role (Student or Teacher). You\'ll receive a verification email to activate your account.',
      },
      {
        question: 'Is Sipsawiya free to use?',
        answer:
          'Yes! Sipsawiya is completely free for students. Teachers can create and manage classes at no cost. We believe in making education accessible to everyone.',
      },
      {
        question: 'What do I need to get started as a student?',
        answer:
          'All you need is an email address to register. Once your account is verified, you can browse and enroll in any available class. No prior setup or software installation is required.',
      },
      {
        question: 'Can I use Sipsawiya on my mobile device?',
        answer:
          'Yes! Sipsawiya is fully responsive and works on all modern browsers, whether you\'re on a desktop, tablet, or smartphone.',
      },
    ],
  },
  {
    title: 'Courses & Classes',
    icon: BookOpen,
    color: 'purple',
    items: [
      {
        question: 'How do I find and enroll in a class?',
        answer:
          'Navigate to the "Classes" page from the menu. You can search by class name, teacher, or use filters like category and difficulty level. Once you find a class you like, click "Enroll Now" to join instantly.',
      },
      {
        question: 'What types of materials are available in classes?',
        answer:
          'Teachers can upload various types of materials including PDFs, documents, and video lessons (including YouTube links). Materials are organized into sections for easy navigation.',
      },
      {
        question: 'Can I enroll in multiple classes at once?',
        answer:
          'Absolutely! There\'s no limit to the number of classes you can enroll in. Manage all your enrollments from your student dashboard.',
      },
      {
        question: 'How do I access my enrolled classes?',
        answer:
          'After logging in, go to your Dashboard where you\'ll find all your enrolled classes. Click on any class to access its materials, sections, and resources.',
      },
    ],
  },
  {
    title: 'For Teachers',
    icon: Users,
    color: 'emerald',
    items: [
      {
        question: 'How do I become a teacher on Sipsawiya?',
        answer:
          'Register for an account and select "Teacher" as your role. Complete your profile with your qualifications, experience, and specialization. Once set up, you can start creating classes immediately.',
      },
      {
        question: 'How do I create a class?',
        answer:
          'From your Teacher Dashboard, click "Create Class." Fill in the class details including name, description, category, and difficulty level. You can then add sections and upload materials.',
      },
      {
        question: 'What types of content can I upload?',
        answer:
          'You can upload PDFs, documents, images, and embed YouTube video links. Materials can be organized into sections within each class for better structure.',
      },
      {
        question: 'Can I see how many students are in my class?',
        answer:
          'Yes! Your teacher dashboard shows enrollment statistics for each class, including total student count and recent enrollments.',
      },
    ],
  },
  {
    title: 'Account & Settings',
    icon: Settings,
    color: 'orange',
    items: [
      {
        question: 'How do I reset my password?',
        answer:
          'Click "Forgot Password" on the login page. Enter your registered email address and we\'ll send you a password reset link. Follow the link to create a new password.',
      },
      {
        question: 'How do I update my profile?',
        answer:
          'Log into your account and navigate to the "Profile" section in your dashboard. You can update your name, profile picture, bio, and other details.',
      },
      {
        question: 'I\'m not receiving verification emails. What should I do?',
        answer:
          'Check your spam/junk folder first. If you still haven\'t received the email, try clicking "Resend Verification" on the verification page. Make sure you entered the correct email address during registration.',
      },
      {
        question: 'Can I change my role from Student to Teacher?',
        answer:
          'Role changes require administrator assistance. Please contact our support team through the Contact Us page with your request.',
      },
    ],
  },
]

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-start justify-between gap-4 text-left group"
      >
        <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
          {item.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-white/30 flex-shrink-0 mt-0.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-white/40 leading-relaxed pb-5 pr-8">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (key: string) => {
    const next = new Set(openItems)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setOpenItems(next)
  }

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      {/* Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/50 mb-10">
            Find answers to common questions about using Sipsawiya LMS.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="faq-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQ..."
              className="w-full pl-12 pr-4 py-4 glass text-white rounded-2xl border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </motion.div>
      </section>

      {/* FAQ Content */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pb-24">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl border border-white/5">
            <HelpCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-white/40 mb-4">Try a different search term.</p>
            <button onClick={() => setSearchQuery('')} className="text-sm text-blue-400 hover:underline">
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1, duration: 0.4 }}
                className="glass rounded-2xl border border-white/5 overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-${category.color}-500/20 flex items-center justify-center`}>
                    <category.icon className={`w-4 h-4 text-${category.color}-400`} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{category.title}</h2>
                  <span className="text-xs text-white/20 ml-auto">{category.items.length} questions</span>
                </div>
                <div className="px-6">
                  {category.items.map((item, itemIndex) => {
                    const key = `${catIndex}-${itemIndex}`
                    return (
                      <FAQAccordion
                        key={key}
                        item={item}
                        isOpen={openItems.has(key)}
                        onToggle={() => toggleItem(key)}
                      />
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center glass rounded-3xl p-10 border border-white/5"
        >
          <h3 className="text-xl font-bold text-white mb-3">Still have questions?</h3>
          <p className="text-white/40 mb-6 text-sm">
            Can't find what you're looking for? Our team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 premium-gradient text-white rounded-xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-blue-600/20"
          >
            Contact Support
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
