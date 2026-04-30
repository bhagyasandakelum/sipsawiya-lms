"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import {
    BookOpen,
    Video,
    FileText,
    Youtube,
    Plus,
    ArrowLeft,
    Loader2,
    Clock,
    MoreVertical,
    Download,
    ExternalLink,
    Trash2,
    Users,
    GraduationCap,
    CheckCircle2,
    Radio
} from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"

export default function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: session } = useSession()
    const [classData, setClassData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("MATERIALS")
    const [showAddMaterial, setShowAddMaterial] = useState(false)
    const [showGoLive, setShowGoLive] = useState(false)
    const [liveUrl, setLiveUrl] = useState("")

    const [newMaterial, setNewMaterial] = useState({
        title: "",
        section: "General", // Using description field as section in DB
        type: "NOTE",
        url: ""
    })
    const [adding, setAdding] = useState(false)

    const isTeacher = (session?.user as any)?.role === "TEACHER" || (session?.user as any)?.role === "ADMIN"

    useEffect(() => {
        fetchClass()
    }, [id])

    const fetchClass = async () => {
        try {
            const res = await fetch(`/api/classes/${id}`)
            const data = await res.json()
            if (res.ok) {
                setClassData(data)
            }
        } catch (err) {
            console.error("Failed to fetch class")
        } finally {
            setLoading(false)
        }
    }

    const handleAddMaterial = async (e: React.FormEvent) => {
        e.preventDefault()
        setAdding(true)

        try {
            const res = await fetch("/api/materials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title: newMaterial.title,
                    description: newMaterial.section, // Save section name in description
                    type: newMaterial.type,
                    url: newMaterial.url,
                    classId: id 
                })
            })

            if (res.ok) {
                setShowAddMaterial(false)
                setNewMaterial({ title: "", section: "General", type: "NOTE", url: "" })
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to add material")
        } finally {
            setAdding(false)
        }
    }

    const handleGoLive = async (e: React.FormEvent) => {
        e.preventDefault()
        setAdding(true)

        try {
            // First, remove any existing live stream to keep only one active
            const existingLive = classData.materials?.find((m: any) => m.type === 'YOUTUBE_LIVE')
            if (existingLive) {
                await fetch(`/api/materials?id=${existingLive.id}`, { method: 'DELETE' })
            }

            const res = await fetch("/api/materials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title: "Live Session",
                    description: "LIVE",
                    type: "YOUTUBE_LIVE",
                    url: liveUrl,
                    classId: id 
                })
            })

            if (res.ok) {
                setShowGoLive(false)
                setLiveUrl("")
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to go live")
        } finally {
            setAdding(false)
        }
    }

    const handleEndLive = async (materialId: string) => {
        if(!confirm("End live stream?")) return;
        try {
            await fetch(`/api/materials?id=${materialId}`, { method: 'DELETE' })
            fetchClass()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!classData) {
        return (
            <div className="text-center py-20">
                <p className="text-xl font-bold">Class not found</p>
                <Link href="/dashboard/classes" className="text-blue-400 hover:underline mt-4 inline-block">
                    Back to Classes
                </Link>
            </div>
        )
    }

    // Process materials
    const liveStreamMaterial = classData.materials?.find((m: any) => m.type === 'YOUTUBE_LIVE')
    const regularMaterials = classData.materials?.filter((m: any) => m.type !== 'YOUTUBE_LIVE') || []

    // Extract youtube video id from url (e.g. watch?v=... or youtu.be/...)
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Group materials by section
    const groupedMaterials = regularMaterials.reduce((acc: any, material: any) => {
        const section = material.description || 'General';
        if (!acc[section]) acc[section] = [];
        acc[section].push(material);
        return acc;
    }, {});

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 pb-20"
        >
            <Link href="/dashboard/classes" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit">
                <ArrowLeft size={18} />
                Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left Column: Class Info & Tabs */}
                <div className="flex-1 space-y-8 w-full">
                    {liveStreamMaterial && (
                        <div className="bg-white p-2 rounded-[2rem] overflow-hidden border border-red-200 shadow-[0_8px_30px_rgba(239,68,68,0.1)] animate-in fade-in zoom-in duration-500">
                            <div className="bg-red-50 text-red-600 font-bold px-6 py-3 flex items-center justify-between rounded-t-[1.5rem]">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    LIVE NOW
                                </div>
                                {isTeacher && (
                                    <button onClick={() => handleEndLive(liveStreamMaterial.id)} className="text-xs bg-red-100 px-3 py-1 rounded-full hover:bg-red-200 transition-colors text-red-700 font-bold">
                                        End Stream
                                    </button>
                                )}
                            </div>
                            <div className="aspect-video w-full bg-black rounded-b-[1.5rem] overflow-hidden">
                                <iframe 
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${getYoutubeId(liveStreamMaterial.url) || ''}?autoplay=1&live=1`}
                                    title="YouTube live stream"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    <div className="glass bg-white/60 p-8 rounded-[2rem] relative overflow-hidden border border-blue-100">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-blue-900">
                            <BookOpen size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-bold mb-4 text-blue-950">{classData.name}</h1>
                                    <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                                        {classData.description || "No description provided for this class."}
                                    </p>
                                </div>
                                {isTeacher && !liveStreamMaterial && (
                                    <button 
                                        onClick={() => setShowGoLive(true)}
                                        className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all active:scale-95"
                                    >
                                        <Radio size={18} />
                                        Go Live
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mt-8">
                                <div className="px-4 py-2 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center gap-2 text-sm text-slate-600">
                                    <Clock size={16} className="text-blue-500" />
                                    Created {new Date(classData.createdAt).toLocaleDateString()}
                                </div>
                                <div className="px-4 py-2 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center gap-2 text-sm text-slate-600">
                                    <Video size={16} className="text-purple-500" />
                                    {regularMaterials.length} Materials
                                </div>
                                <div className="px-4 py-2 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center gap-2 text-sm text-slate-600">
                                    <Users size={16} className="text-green-500" />
                                    {classData.enrollments?.length || 0} Participants
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-2 p-2 glass bg-white/60 border border-blue-100 rounded-2xl w-fit">
                        {[
                            { id: "MATERIALS", label: "Materials", icon: FileText },
                            { id: "PARTICIPANTS", label: "Participants", icon: Users },
                            { id: "GRADES", label: "Grades", icon: GraduationCap },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                                        ? "bg-blue-100 text-blue-700 shadow-sm"
                                        : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Based on Active Tab */}
                    {activeTab === "MATERIALS" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-blue-950">Course Sections & Resources</h2>
                                {isTeacher && (
                                    <button
                                        onClick={() => setShowAddMaterial(true)}
                                        className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                    >
                                        <Plus size={18} /> Add Resource
                                    </button>
                                )}
                            </div>

                            {regularMaterials.length === 0 ? (
                                <div className="glass bg-white/60 p-12 rounded-[2rem] text-center border-dashed border-blue-200">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-300">
                                        <FileText size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-950">No course materials yet</h3>
                                    <p className="text-slate-500 mt-2">Start by dividing your course into sections and adding resources.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {Object.entries(groupedMaterials).map(([sectionName, materials]: [string, any]) => (
                                        <div key={sectionName} className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-xl font-bold text-blue-600">{sectionName}</h3>
                                                <div className="flex-1 h-px bg-blue-100"></div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-4">
                                                {materials.map((item: any) => (
                                                    <div key={item.id} className="glass bg-white/60 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-5 group hover:bg-white hover:shadow-md transition-all border border-blue-100 relative overflow-hidden">
                                                        <div className={`w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center ${
                                                            item.type === 'VIDEO' || item.type === 'YOUTUBE' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                                        }`}>
                                                            {item.type === 'VIDEO' || item.type === 'YOUTUBE' ? <Youtube size={22} /> : <FileText size={22} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-lg leading-tight mb-1 text-blue-950 truncate group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                                <span className="uppercase tracking-wider font-semibold">{item.type}</span>
                                                                <span>&bull;</span>
                                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                                            <a
                                                                href={item.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium text-sm flex items-center gap-2 transition-all"
                                                            >
                                                                Open <ExternalLink size={14} />
                                                            </a>
                                                            {isTeacher && (
                                                                <button 
                                                                    onClick={async () => {
                                                                        if(confirm('Delete this resource?')) {
                                                                            await fetch(`/api/materials?id=${item.id}`, { method: 'DELETE' })
                                                                            fetchClass()
                                                                        }
                                                                    }}
                                                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "PARTICIPANTS" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-blue-950">Class Participants</h2>
                            </div>

                            {classData.enrollments?.length === 0 ? (
                                <div className="glass bg-white/60 p-12 rounded-[2rem] text-center border-dashed border-blue-200">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-300">
                                        <Users size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-950">No participants yet</h3>
                                    <p className="text-slate-500 mt-2">Wait for students to enroll in your class.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {classData.enrollments?.map((enrollment: any) => (
                                        <div key={enrollment.id} className="glass bg-white/60 p-4 rounded-2xl flex items-center gap-4 border border-blue-100 hover:bg-white hover:shadow-sm transition-all">
                                            <div className="w-12 h-12 rounded-full premium-gradient text-white flex flex-shrink-0 items-center justify-center font-bold text-lg">
                                                {enrollment.student?.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-blue-950 truncate">{enrollment.student?.name || 'Student'}</h4>
                                                <p className="text-xs text-slate-500 truncate">{enrollment.student?.email}</p>
                                            </div>
                                            {isTeacher && (
                                                <button className="px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all text-xs font-semibold">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "GRADES" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-blue-950">Assignments & Grades</h2>
                                {isTeacher && (
                                    <button className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                                        <Plus size={18} /> New Assignment
                                    </button>
                                )}
                            </div>
                            <div className="glass bg-white/60 p-12 rounded-[2rem] text-center border-dashed border-blue-200">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-300">
                                    <GraduationCap size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-blue-950">Grades Module Coming Soon</h3>
                                <p className="text-slate-500 mt-2">This feature is currently under development.</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Teacher Sidebar */}
                <div className="w-full md:w-80 space-y-6">
                    <div className="glass bg-white/60 border border-blue-100 p-6 rounded-[2rem] space-y-6">
                        <h3 className="font-bold text-lg px-2 text-blue-950">Instructor</h3>
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-50 shadow-sm">
                            <div className="w-12 h-12 rounded-full premium-gradient text-white flex items-center justify-center font-bold">
                                {classData.teacher?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-blue-950 truncate">{classData.teacher?.name}</p>
                                <p className="text-xs text-slate-500 truncate">{classData.teacher?.degree || 'Expert Educator'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Go Live Modal */}
            {showGoLive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-red-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Radio size={24} /></div>
                                <h2 className="text-2xl font-bold text-blue-950">Start Live Session</h2>
                            </div>
                            <button onClick={() => setShowGoLive(false)} className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-all">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleGoLive} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">YouTube Live Stream URL</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 focus:border-red-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={liveUrl}
                                    onChange={(e) => setLiveUrl(e.target.value)}
                                />
                                <p className="text-xs text-slate-500 ml-1 mt-2">Paste the link to your active YouTube live stream. It will be embedded perfectly for your students.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-white shadow-lg shadow-red-600/20"
                            >
                                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Broadcast to Class"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Material Modal */}
            {showAddMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xl p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-blue-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-blue-950">Add Resources</h2>
                            <button onClick={() => setShowAddMaterial(false)} className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-all">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddMaterial} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-700 ml-1">Section</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                                        placeholder="e.g. Week 1, Chapter 1, Advanced Theory..."
                                        value={newMaterial.section}
                                        onChange={(e) => setNewMaterial({ ...newMaterial, section: e.target.value })}
                                        list="sections-list"
                                    />
                                    <datalist id="sections-list">
                                        {Object.keys(groupedMaterials).map(sec => <option key={sec} value={sec} />)}
                                    </datalist>
                                    <p className="text-xs text-slate-500 ml-1">Type a new section name or select an existing one to group materials.</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Resource Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                                    placeholder="e.g. Lecture Notes PDF"
                                    value={newMaterial.title}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-700 ml-1">Resource Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'NOTE', icon: FileText, label: 'Document / PDF' },
                                            { id: 'YOUTUBE', icon: Youtube, label: 'Recorded Video' },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setNewMaterial({ ...newMaterial, type: t.id })}
                                                className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${newMaterial.type === t.id
                                                    ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                                    : 'bg-white border-blue-100 hover:border-blue-300 text-slate-500 hover:text-blue-600'
                                                    }`}
                                            >
                                                <t.icon size={20} />
                                                <span className="text-sm font-bold">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">URL (Drive Link, PDF Link, or YouTube)</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                                    placeholder="https://..."
                                    value={newMaterial.url}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full py-4 premium-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-blue-600/20"
                            >
                                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Resource"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
