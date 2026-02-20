import Link from 'next/link'
import { GraduationCap, BookOpen, MapPin, Star, Search } from 'lucide-react'

// Mock data to test if the UI works without DB
const mockTeachers = [
    {
        id: '1',
        name: 'Dr. Sarah Connor',
        degree: 'Ph.D. in Physics',
        subjects: 'Physics, Mathematics',
        image: null,
        taughtClasses: [{ id: 'c1' }, { id: 'c2' }]
    },
    {
        id: '2',
        name: 'Prof. John Smith',
        degree: 'M.Sc. in Biology',
        subjects: 'Biology, Chemistry',
        image: null,
        taughtClasses: [{ id: 'c3' }]
    }
]

export default async function TeachersPage() {
    // We'll try to fetch but fallback to mock for now
    let teachers = []
    try {
        // Dynamically import prisma to avoid top-level crash if client is missing
        const { default: prisma } = await import('@/lib/prisma')
        teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' as any },
            include: { taughtClasses: true }
        })
    } catch (error) {
        console.error('DB Fetch failed, showing mock data:', (error as Error).message)
        teachers = mockTeachers
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white">
            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold tracking-tight">Sipsawiya</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                    <Link href="/teachers" className="text-white transition-colors">Teachers</Link>
                    <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="#" className="hover:text-white transition-colors">About</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-white transition-colors">Login</Link>
                    <Link href="/register" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                            Our Expert <span className="text-gradient">Educators</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl text-lg">
                            Learn from the best minds in the industry. Our teachers are dedicated to your success and academic excellence.
                            {teachers === mockTeachers && " (Offline Mode - Showing Mock Data)"}
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search teachers or subjects..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teachers.map((teacher: any) => (
                        <Link
                            key={teacher.id}
                            href={`/teachers/${teacher.id}`}
                            className="group glass rounded-3xl p-6 hover:bg-white/5 transition-all hover:scale-[1.02] border border-white/5"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                    {teacher.image ? (
                                        <img src={teacher.image} alt={teacher.name || 'Teacher'} className="w-full h-full object-cover" />
                                    ) : (
                                        <GraduationCap className="w-8 h-8 text-blue-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{teacher.name}</h3>
                                    <p className="text-blue-400 text-sm font-medium">{teacher.degree || 'Expert Educator'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {(teacher.subjects?.split(',') || []).map((subject: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/5">
                                            {subject.trim()}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{teacher.taughtClasses?.length || 0} Classes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>Online</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
