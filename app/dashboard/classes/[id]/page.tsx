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
    Trash2
} from "lucide-react"
import Link from "next/link"

export default function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [classData, setClassData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showAddMaterial, setShowAddMaterial] = useState(false)
    const [newMaterial, setNewMaterial] = useState({
        title: "",
        description: "",
        type: "NOTE",
        url: ""
    })
    const [adding, setAdding] = useState(false)

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
                body: JSON.stringify({ ...newMaterial, classId: id })
            })

            if (res.ok) {
                setShowAddMaterial(false)
                setNewMaterial({ title: "", description: "", type: "NOTE", url: "" })
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to add material")
        } finally {
            setAdding(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
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

    return (
        <div className="space-y-8 pb-20">
            <Link href="/dashboard/classes" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors w-fit">
                <ArrowLeft size={18} />
                Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left Column: Class Info */}
                <div className="flex-1 space-y-8 w-full">
                    <div className="glass p-8 rounded-[2rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BookOpen size={120} />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold mb-4">{classData.name}</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                {classData.description || "No description provided for this class."}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2 text-sm">
                                    <Clock size={16} className="text-blue-400" />
                                    Created {new Date(classData.createdAt).toLocaleDateString()}
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2 text-sm">
                                    <Video size={16} className="text-purple-400" />
                                    {classData.materials?.length || 0} Materials
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Learning Materials</h2>
                        <button
                            onClick={() => setShowAddMaterial(true)}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                        >
                            <Plus size={18} /> Add Material
                        </button>
                    </div>

                    {classData.materials?.length === 0 ? (
                        <div className="glass p-12 rounded-[2rem] text-center border-dashed">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-bold">No materials yet</h3>
                            <p className="text-muted-foreground mt-2">Start by adding notes, videos, or lecture links.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {classData.materials.map((item: any) => (
                                <div key={item.id} className="glass p-6 rounded-2xl flex items-center gap-6 group hover:bg-white/[0.07] transition-all border border-white/5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.type === 'VIDEO' ? 'bg-purple-500/10 text-purple-400' :
                                            item.type === 'YOUTUBE' ? 'bg-red-500/10 text-red-400' :
                                                'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {item.type === 'VIDEO' ? <Video size={24} /> :
                                            item.type === 'YOUTUBE' ? <Youtube size={24} /> :
                                                <FileText size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-lg truncate">{item.title}</h4>
                                        <p className="text-muted-foreground text-sm truncate">{item.description || 'No description'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 hover:bg-white/10 rounded-xl transition-all text-muted-foreground hover:text-white"
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                        <button className="p-3 hover:bg-red-500/10 rounded-xl transition-all text-muted-foreground hover:text-red-400">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Teacher Sidebar */}
                <div className="w-full md:w-80 space-y-6">
                    <div className="glass p-6 rounded-[2rem] space-y-6">
                        <h3 className="font-bold text-lg px-2">Instructor</h3>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 rounded-full premium-gradient flex items-center justify-center font-bold">
                                {classData.teacher?.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold">{classData.teacher?.name}</p>
                                <p className="text-xs text-muted-foreground">{classData.teacher?.degree || 'Expert Educator'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Material Modal */}
            {showAddMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass w-full max-w-xl p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Add New Material</h2>
                            <button onClick={() => setShowAddMaterial(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddMaterial} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Chapter 1: Introduction to Quantum Mechanics"
                                    value={newMaterial.title}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium ml-1">Material Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'NOTE', icon: FileText, label: 'Note' },
                                            { id: 'VIDEO', icon: Video, label: 'Video' },
                                            { id: 'YOUTUBE', icon: Youtube, label: 'YouTube' },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setNewMaterial({ ...newMaterial, type: t.id })}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${newMaterial.type === t.id
                                                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                                        : 'bg-white/5 border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <t.icon size={20} />
                                                <span className="text-xs font-bold uppercase tracking-tight">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">URL (Document or Video Link)</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="https://..."
                                    value={newMaterial.url}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Description (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-none"
                                    placeholder="Brief summary of the material..."
                                    value={newMaterial.description}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full py-4 premium-gradient rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-blue-600/20"
                            >
                                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload Material"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
