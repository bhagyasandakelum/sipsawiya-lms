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
    ArrowUp,
    ArrowDown,
    Loader2,
    Clock,
    MoreVertical,
    Download,
    ExternalLink,
    Trash2,
    Edit3,
    Users,
    GraduationCap,
    CheckCircle2,
    Radio,
    Monitor,
    ClipboardList,
    Link as LinkIcon,
    Bell,
    Upload,
    Check
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import api from "@/lib/api"

export default function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { user } = useAuth()
    const router = useRouter()
    
    const [classData, setClassData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("MATERIALS")
    
    // Section Modals/State
    const [showAddSection, setShowAddSection] = useState(false)
    const [sectionName, setSectionName] = useState("")
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState("")

    // Material Modals/State
    const [showAddMaterial, setShowAddMaterial] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<number | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [newMaterial, setNewMaterial] = useState({
        title: "",
        sectionId: "",
        description: "",
        type: "NOTE",
        url: ""
    })
    const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null)
    const [editingMaterial, setEditingMaterial] = useState<any>({
        title: "",
        description: "",
        type: "NOTE",
        url: "",
        sectionId: ""
    })
    
    // Live Stream Modals/State
    const [showGoLive, setShowGoLive] = useState(false)
    const [liveUrl, setLiveUrl] = useState("")

    // Announcements state
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [showAddNotice, setShowAddNotice] = useState(false)
    const [noticeContent, setNoticeContent] = useState("")
    const [noticeTitle, setNoticeTitle] = useState("")
    const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null)
    const [editingNoticeContent, setEditingNoticeContent] = useState("")

    const [actionLoading, setActionLoading] = useState(false)

    const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN"

    useEffect(() => {
        fetchClass()
        fetchAnnouncements()
    }, [id])

    const fetchClass = async () => {
        try {
            const res = await api.get(`/classes/${id}`)
            if (res.data?.success) {
                setClassData(res.data.data)
            }
        } catch (err) {
            console.error("Failed to fetch class details", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get(`/notices?classId=${id}`)
            if (res.data?.success) {
                setAnnouncements(res.data.data)
            }
        } catch (err) {
            console.error("Failed to fetch notices", err)
        }
    }

    // Toggle Published Status
    const handleTogglePublish = async () => {
        setActionLoading(true)
        try {
            const res = await api.put(`/classes/${id}`, {
                published: !classData.published
            })
            if (res.data?.success) {
                setClassData((prev: any) => ({ ...prev, published: !prev.published }))
            }
        } catch (err) {
            console.error("Failed to toggle publish state", err)
        } finally {
            setActionLoading(false)
        }
    }

    // ==========================================
    // SECTION ACTIONS
    // ==========================================
    const handleCreateSection = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!sectionName.trim()) return
        setActionLoading(true)
        try {
            const res = await api.post("/sections", {
                classId: id,
                name: sectionName
            })
            if (res.data?.success) {
                setSectionName("")
                setShowAddSection(false)
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to create section", err)
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateSectionName = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSectionName.trim() || !editingSectionId) return
        setActionLoading(true)
        try {
            const res = await api.put(`/sections/${editingSectionId}`, {
                name: editingSectionName
            })
            if (res.data?.success) {
                setEditingSectionId(null)
                setEditingSectionName("")
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to rename section", err)
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm("Are you sure you want to delete this section? All materials inside it will be permanently deleted.")) return
        try {
            const res = await api.delete(`/sections/${sectionId}`)
            if (res.data?.success) {
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to delete section", err)
        }
    }

    const handleReorderSection = async (currentIndex: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
        if (targetIndex < 0 || targetIndex >= classData.sections.length) return

        const reordered = [...classData.sections]
        const temp = reordered[currentIndex]
        reordered[currentIndex] = reordered[targetIndex]
        reordered[targetIndex] = temp

        try {
            const sectionIds = reordered.map((sec: any) => sec.id)
            // Update UI locally first
            setClassData((prev: any) => ({ ...prev, sections: reordered }))
            await api.post("/sections/reorder", {
                classId: id,
                sectionIds
            })
        } catch (err) {
            console.error("Failed to save section order", err)
            fetchClass()
        }
    }

    // ==========================================
    // MATERIAL ACTIONS
    // ==========================================
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setSelectedFile(file)
        setUploadProgress(0)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await api.post("/materials/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0
                    setUploadProgress(progress)
                }
            })

            if (res.data?.success) {
                const uploadedUrl = res.data.data.url
                if (editingMaterialId) {
                    setEditingMaterial((prev: any) => ({ ...prev, url: uploadedUrl }))
                } else {
                    setNewMaterial((prev: any) => ({ ...prev, url: uploadedUrl }))
                }
                setUploadProgress(100)
            }
        } catch (err) {
            console.error("File upload failed", err)
            alert("File upload failed. Please try again.")
            setUploadProgress(null)
            setSelectedFile(null)
        }
    }

    const handleAddMaterial = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMaterial.title || !newMaterial.url) return
        setActionLoading(true)

        try {
            const res = await api.post("/materials", {
                title: newMaterial.title,
                description: newMaterial.description,
                type: newMaterial.type,
                url: newMaterial.url,
                classId: id,
                sectionId: newMaterial.sectionId || undefined
            })

            if (res.data?.success) {
                setShowAddMaterial(false)
                setNewMaterial({ title: "", sectionId: "", description: "", type: "NOTE", url: "" })
                setSelectedFile(null)
                setUploadProgress(null)
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to add material", err)
        } finally {
            setActionLoading(false)
        }
    }

    const handleStartEditMaterial = (item: any) => {
        // Find sectionId of this material
        const matchingSection = classData.sections?.find((sec: any) => 
            sec.materials?.some((m: any) => m.id === item.id)
        )
        setEditingMaterialId(item.id)
        setEditingMaterial({
            title: item.title,
            description: item.description || "",
            type: item.type,
            url: item.url,
            sectionId: matchingSection?.id || ""
        })
    }

    const handleUpdateMaterial = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingMaterialId || !editingMaterial.title || !editingMaterial.url) return
        setActionLoading(true)

        try {
            const res = await api.put(`/materials/${editingMaterialId}`, {
                title: editingMaterial.title,
                description: editingMaterial.description,
                type: editingMaterial.type,
                url: editingMaterial.url,
                sectionId: editingMaterial.sectionId || null
            })

            if (res.data?.success) {
                setEditingMaterialId(null)
                setSelectedFile(null)
                setUploadProgress(null)
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to update material", err)
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteMaterial = async (materialId: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return
        try {
            const res = await api.delete(`/materials/${materialId}`)
            if (res.data?.success) {
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to delete material", err)
        }
    }

    const handleReorderMaterial = async (secId: string, currentIndex: number, direction: "up" | "down") => {
        const section = classData.sections.find((s: any) => s.id === secId)
        if (!section) return

        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
        if (targetIndex < 0 || targetIndex >= section.materials.length) return

        const reorderedMaterials = [...section.materials]
        const temp = reorderedMaterials[currentIndex]
        reorderedMaterials[currentIndex] = reorderedMaterials[targetIndex]
        reorderedMaterials[targetIndex] = temp

        try {
            // Optimistic UI update
            const updatedSections = classData.sections.map((s: any) => {
                if (s.id === secId) {
                    return { ...s, materials: reorderedMaterials }
                }
                return s
            })
            setClassData((prev: any) => ({ ...prev, sections: updatedSections }))

            const materialIds = reorderedMaterials.map((m: any) => m.id)
            await api.post("/materials/reorder", {
                classId: id,
                sectionId: secId,
                materialIds
            })
        } catch (err) {
            console.error("Failed to reorder materials", err)
            fetchClass()
        }
    }

    // ==========================================
    // ANNOUNCEMENT (NOTICE) ACTIONS
    // ==========================================
    const handleCreateNotice = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!noticeContent.trim()) return
        setActionLoading(true)

        try {
            const res = await api.post("/notices", {
                content: noticeContent,
                title: noticeTitle.trim() || undefined,
                classId: id
            })
            if (res.data?.success) {
                setNoticeContent("")
                setNoticeTitle("")
                setShowAddNotice(false)
                fetchAnnouncements()
            }
        } catch (err) {
            console.error("Failed to create notice", err)
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateNotice = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingNoticeContent.trim() || !editingNoticeId) return
        setActionLoading(true)

        try {
            const res = await api.put(`/notices/${editingNoticeId}`, {
                content: editingNoticeContent
            })
            if (res.data?.success) {
                setEditingNoticeId(null)
                setEditingNoticeContent("")
                fetchAnnouncements()
            }
        } catch (err) {
            console.error("Failed to edit notice", err)
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteNotice = async (noticeId: string) => {
        if (!confirm("Delete this notice?")) return
        try {
            const res = await api.delete(`/notices/${noticeId}`)
            if (res.data?.success) {
                fetchAnnouncements()
            }
        } catch (err) {
            console.error("Failed to delete notice", err)
        }
    }

    // ==========================================
    // LIVE BROADCAST ACTIONS
    // ==========================================
    const handleGoLive = async (e: React.FormEvent) => {
        e.preventDefault()
        setActionLoading(true)

        try {
            // Find and delete any existing live broadcast material to replace it
            const existingLive = classData.materials?.find((m: any) => m.type === 'YOUTUBE_LIVE')
            if (existingLive) {
                await api.delete(`/materials/${existingLive.id}`)
            }

            const res = await api.post("/materials", {
                title: "Live Lecture Broadcast",
                description: "ACTIVE_LIVE",
                type: "YOUTUBE_LIVE",
                url: liveUrl,
                classId: id
            })

            if (res.data?.success) {
                setShowGoLive(false)
                setLiveUrl("")
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to broadcast live stream", err)
        } finally {
            setActionLoading(false)
        }
    }

    const handleEndLive = async (materialId: string) => {
        if (!confirm("Are you sure you want to end this live broadcast?")) return
        try {
            const res = await api.delete(`/materials/${materialId}`)
            if (res.data?.success) {
                fetchClass()
            }
        } catch (err) {
            console.error("Failed to end live stream", err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!classData) {
        return (
            <div className="text-center py-32 glass rounded-3xl border border-white/5 max-w-xl mx-auto">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-25" />
                <h3 className="text-2xl font-bold text-white">Class not found</h3>
                <p className="text-muted-foreground mt-2">This course does not exist or has been deleted.</p>
                <Link href="/dashboard/classes" className="mt-6 inline-flex px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 text-white font-medium transition-all">
                    Back to Classes
                </Link>
            </div>
        )
    }

    // Identify active live streams
    const liveStreamMaterial = classData.materials?.find((m: any) => m.type === 'YOUTUBE_LIVE')

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 pb-20 text-white"
        >
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/classes" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors w-fit font-medium">
                    <ArrowLeft size={18} />
                    Back to Classes
                </Link>

                {isTeacher && (
                    <button
                        onClick={handleTogglePublish}
                        disabled={actionLoading}
                        className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95 border ${
                            classData.published 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20"
                        }`}
                    >
                        {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        {classData.published ? "Published (Unpublish)" : "Draft (Publish)"}
                    </button>
                )}
            </div>

            {/* Live Session Notice */}
            {liveStreamMaterial && (
                <div className="glass p-2 rounded-[2.5rem] overflow-hidden border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)] animate-in fade-in duration-500">
                    <div className="bg-red-500/10 text-red-400 font-bold px-6 py-4 flex items-center justify-between rounded-t-[2rem]">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3.5 w-3.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                            </span>
                            LIVE LECTURE BROADCAST
                        </div>
                        {isTeacher && (
                            <button 
                                onClick={() => handleEndLive(liveStreamMaterial.id)} 
                                className="text-xs bg-red-600 px-4 py-2 rounded-xl hover:bg-red-500 transition-all text-white font-bold"
                            >
                                End Broadcast
                            </button>
                        )}
                    </div>
                    <div className="aspect-video w-full bg-black rounded-b-[2rem] overflow-hidden">
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

            {/* Banner Section */}
            <div className="glass p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden" style={classData.thumbnail ? { backgroundImage: `url(${classData.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                <div className="absolute inset-0 bg-black/75 z-0"></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 text-white z-0">
                    <BookOpen size={160} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">{classData.name}</h1>
                        <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed text-slate-300">
                            {classData.description || "No course description provided."}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-4">
                            {classData.year && (
                                <span className="px-3.5 py-1.5 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold flex items-center gap-1.5">
                                    <GraduationCap size={14} className="text-yellow-400" />
                                    {classData.year}
                                </span>
                            )}
                            <span className="px-3.5 py-1.5 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center gap-1.5">
                                <Clock size={14} className="text-blue-400" />
                                {classData.sections?.length || 0} Sections
                            </span>
                            <span className="px-3.5 py-1.5 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center gap-1.5">
                                <Users size={14} className="text-purple-400" />
                                {classData.enrollmentCount || 0} Students Enrolled
                            </span>
                        </div>
                    </div>
                    {isTeacher && !liveStreamMaterial && (
                        <button 
                            onClick={() => setShowGoLive(true)}
                            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95 self-start md:self-auto"
                        >
                            <Radio size={18} />
                            Go Broadcast Live
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl w-fit">
                {[
                    { id: "MATERIALS", label: "Course Builder", icon: FileText },
                    { id: "ANNOUNCEMENTS", label: `Announcements (${announcements.length})`, icon: Bell },
                    { id: "PARTICIPANTS", label: "Participants", icon: Users },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === tab.id
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab: MATERIALS (Course Builder) */}
            {activeTab === "MATERIALS" && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
                            <p className="text-sm text-muted-foreground mt-1">Organize your course content into modules, topics, and upload attachments.</p>
                        </div>
                        {isTeacher && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowAddSection(true)}
                                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 text-sm"
                                >
                                    <Plus size={16} /> Create Section
                                </button>
                                <button
                                    onClick={() => setShowAddMaterial(true)}
                                    className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-600/10 text-sm"
                                >
                                    <Plus size={16} /> Add Material
                                </button>
                            </div>
                        )}
                    </div>

                    {classData.sections?.length === 0 ? (
                        <div className="glass p-16 rounded-[2.5rem] text-center border-2 border-dashed border-white/5">
                            <BookOpen size={40} className="text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-white">Curriculum is empty</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Create a section first to start grouping learning resources, notes, and links.</p>
                            {isTeacher && (
                                <button
                                    onClick={() => setShowAddSection(true)}
                                    className="mt-6 px-5 py-2.5 bg-blue-600 rounded-xl hover:bg-blue-500 font-bold transition-all text-sm inline-flex items-center gap-2"
                                >
                                    <Plus size={16} /> Create Your First Section
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {classData.sections.map((section: any, secIdx: number) => (
                                <div key={section.id} className="glass p-6 rounded-[2rem] border border-white/5 bg-slate-900/30">
                                    
                                    {/* Section Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6 gap-4">
                                        <div className="flex-1 min-w-0">
                                            {editingSectionId === section.id ? (
                                                <form onSubmit={handleUpdateSectionName} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-blue-500 text-sm w-full max-w-md"
                                                        value={editingSectionName}
                                                        onChange={(e) => setEditingSectionName(e.target.value)}
                                                    />
                                                    <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all">
                                                        <Check size={14} />
                                                    </button>
                                                    <button onClick={() => setEditingSectionId(null)} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-xs font-semibold">
                                                        Cancel
                                                    </button>
                                                </form>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl font-extrabold text-blue-400 tracking-tight truncate">{section.name}</h3>
                                                    {isTeacher && (
                                                        <button 
                                                            onClick={() => {
                                                                setEditingSectionId(section.id)
                                                                setEditingSectionName(section.name)
                                                            }}
                                                            className="p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-all"
                                                        >
                                                            <Edit3 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {isTeacher && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={secIdx === 0}
                                                    onClick={() => handleReorderSection(secIdx, "up")}
                                                    className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all disabled:opacity-25"
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button
                                                    disabled={secIdx === classData.sections.length - 1}
                                                    onClick={() => handleReorderSection(secIdx, "down")}
                                                    className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all disabled:opacity-25"
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSection(section.id)}
                                                    className="p-1.5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded-lg transition-all ml-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Section Materials */}
                                    {section.materials?.length === 0 ? (
                                        <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                            <p className="text-xs text-muted-foreground">No resources in this section.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {section.materials.map((item: any, matIdx: number) => (
                                                <div key={item.id} className="bg-white/[0.02] p-4 rounded-xl flex items-center justify-between border border-white/5 hover:bg-white/[0.05] transition-all gap-4 group">
                                                    
                                                    {/* Material Title and Info */}
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${
                                                            item.type === 'VIDEO' || item.type === 'YOUTUBE' ? 'bg-red-500/10 text-red-400' :
                                                            item.type === 'PRESENTATION' ? 'bg-orange-500/10 text-orange-400' :
                                                            item.type === 'LINK' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            item.type === 'MEET' ? 'bg-purple-500/10 text-purple-400' :
                                                            'bg-blue-500/10 text-blue-400'
                                                        }`}>
                                                            {item.type === 'VIDEO' || item.type === 'YOUTUBE' ? <Youtube size={18} /> :
                                                             item.type === 'PRESENTATION' ? <Monitor size={18} /> :
                                                             item.type === 'LINK' ? <LinkIcon size={18} /> :
                                                             item.type === 'MEET' ? <Video size={18} /> :
                                                             <FileText size={18} />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                                                            {item.description && (
                                                                <p className="text-xs text-muted-foreground truncate max-w-xl">{item.description}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Material Controls */}
                                                    <div className="flex items-center gap-3">
                                                        <a 
                                                            href={item.url} 
                                                            target="_blank" 
                                                            rel="noreferrer" 
                                                            className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                                                        >
                                                            Open <ExternalLink size={12} />
                                                        </a>

                                                        {isTeacher && (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    disabled={matIdx === 0}
                                                                    onClick={() => handleReorderMaterial(section.id, matIdx, "up")}
                                                                    className="p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-all disabled:opacity-25"
                                                                >
                                                                    <ArrowUp size={14} />
                                                                </button>
                                                                <button
                                                                    disabled={matIdx === section.materials.length - 1}
                                                                    onClick={() => handleReorderMaterial(section.id, matIdx, "down")}
                                                                    className="p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-all disabled:opacity-25"
                                                                >
                                                                    <ArrowDown size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStartEditMaterial(item)}
                                                                    className="p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-all ml-2"
                                                                >
                                                                    <Edit3 size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMaterial(item.id)}
                                                                    className="p-1 hover:bg-red-500/20 rounded text-muted-foreground hover:text-red-400 transition-all"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab: ANNOUNCEMENTS */}
            {activeTab === "ANNOUNCEMENTS" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Class Announcements</h2>
                            <p className="text-sm text-muted-foreground mt-1">Broadcast general updates, reminders, and notifications to all enrolled students.</p>
                        </div>
                        {isTeacher && (
                            <button
                                onClick={() => setShowAddNotice(true)}
                                className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-600/10 text-sm"
                            >
                                <Plus size={16} /> New Announcement
                            </button>
                        )}
                    </div>

                    {announcements.length === 0 ? (
                        <div className="glass p-16 rounded-[2.5rem] text-center border-2 border-dashed border-white/5">
                            <Bell size={40} className="text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-white">No announcements yet</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Announcements posted by the instructor will appear here for all students.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-4xl">
                            {announcements.map((notice: any) => (
                                <div key={notice.id} className="glass p-6 rounded-2xl border-l-4 border-l-purple-500 border border-white/5 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center font-bold text-sm text-white">
                                                {notice.teacher?.teacherProfile?.name?.[0]?.toUpperCase() || 'T'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">
                                                    {notice.teacher?.teacherProfile?.name || "Instructor"}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                    <Clock size={12} />
                                                    {new Date(notice.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {isTeacher && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => {
                                                        setEditingNoticeId(notice.id)
                                                        setEditingNoticeContent(notice.content)
                                                    }}
                                                    className="p-1.5 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-all"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNotice(notice.id)}
                                                    className="p-1.5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {editingNoticeId === notice.id ? (
                                        <form onSubmit={handleUpdateNotice} className="space-y-3 pt-2">
                                            <textarea
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none transition-all text-white min-h-[80px] text-sm"
                                                value={editingNoticeContent}
                                                onChange={(e) => setEditingNoticeContent(e.target.value)}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button type="button" onClick={() => setEditingNoticeId(null)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold text-white">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pl-1">{notice.content}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab: PARTICIPANTS */}
            {activeTab === "PARTICIPANTS" && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Enrolled Students</h2>
                    
                    {classData.enrollments?.length === 0 ? (
                        <div className="glass p-16 rounded-[2.5rem] text-center border-2 border-dashed border-white/5">
                            <Users size={40} className="text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-white">No participants yet</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Students will appear here once they enroll in your course.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classData.enrollments.map((enr: any) => (
                                <div key={enr.id} className="glass p-4 rounded-2xl flex items-center gap-4 border border-white/5 hover:bg-white/5 transition-all">
                                    <div className="w-10 h-10 rounded-full premium-gradient text-white flex items-center justify-center font-bold text-sm">
                                        {enr.student?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-white text-sm truncate">{enr.student?.name || "Student"}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{enr.student?.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal: Create Section */}
            {showAddSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-white">Create Section</h2>
                            <button onClick={() => setShowAddSection(false)} className="p-2 hover:bg-white/10 text-muted-foreground rounded-xl transition-all">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSection} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Section Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                                    placeholder="e.g. Chapter 1: Foundations"
                                    value={sectionName}
                                    onChange={(e) => setSectionName(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Section"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Add Resource Material */}
            {showAddMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass w-full max-w-xl p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-white">Add Curriculum Resource</h2>
                            <button onClick={() => setShowAddMaterial(false)} className="p-2 hover:bg-white/10 text-muted-foreground rounded-xl transition-all">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddMaterial} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                                    placeholder="e.g. Lecture Slides PDF"
                                    value={newMaterial.title}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Section (Optional)</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white text-sm"
                                    value={newMaterial.sectionId}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, sectionId: e.target.value })}
                                >
                                    <option value="" className="bg-slate-950 text-slate-400">General (No Section)</option>
                                    {classData.sections?.map((sec: any) => (
                                        <option key={sec.id} value={sec.id} className="bg-slate-950 text-white">{sec.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Resource Type</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {[
                                        { id: 'NOTE', icon: FileText, label: 'Document / PDF' },
                                        { id: 'VIDEO', icon: Video, label: 'Video Clip' },
                                        { id: 'YOUTUBE', icon: Youtube, label: 'YouTube Video' },
                                        { id: 'PRESENTATION', icon: Monitor, label: 'Presentation' },
                                        { id: 'LINK', icon: LinkIcon, label: 'Web Link' },
                                        { id: 'MEET', icon: Video, label: 'Live Meet' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setNewMaterial({ ...newMaterial, type: t.id })}
                                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${newMaterial.type === t.id
                                                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                                : 'bg-white/5 border-transparent text-muted-foreground hover:text-white'
                                                }`}
                                        >
                                            <t.icon size={16} />
                                            <span className="text-xs font-bold">{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* File Uploader for native uploads */}
                            {['NOTE', 'VIDEO', 'PRESENTATION'].includes(newMaterial.type) && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Upload File</label>
                                    <div className="relative border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileUpload}
                                        />
                                        <Upload size={24} className="text-muted-foreground mb-2" />
                                        <span className="text-xs font-bold text-white">
                                            {selectedFile ? selectedFile.name : "Choose PDF, PPT, Word or MP4 Video..."}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground mt-1">Max file size: 100MB</span>
                                        
                                        {uploadProgress !== null && (
                                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-4">
                                                <div 
                                                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">
                                    {['NOTE', 'VIDEO', 'PRESENTATION'].includes(newMaterial.type) ? "File URL (Auto-filled on upload, or paste link)" : "Link URL"}
                                </label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                                    placeholder="https://..."
                                    value={newMaterial.url}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Description (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm min-h-[70px]"
                                    placeholder="Add brief details about this resource..."
                                    value={newMaterial.description}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={actionLoading || (uploadProgress !== null && uploadProgress < 100)}
                                className="w-full py-4 premium-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 text-sm"
                            >
                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Resource"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Material Resource */}
            {editingMaterialId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass w-full max-w-xl p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-white">Edit Curriculum Resource</h2>
                            <button onClick={() => setEditingMaterialId(null)} className="p-2 hover:bg-white/10 text-muted-foreground rounded-xl transition-all">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateMaterial} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                                    value={editingMaterial.title}
                                    onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Section</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white text-sm"
                                    value={editingMaterial.sectionId}
                                    onChange={(e) => setEditingMaterial({ ...editingMaterial, sectionId: e.target.value })}
                                >
                                    <option value="" className="bg-slate-950 text-slate-400">General (No Section)</option>
                                    {classData.sections?.map((sec: any) => (
                                        <option key={sec.id} value={sec.id} className="bg-slate-950 text-white">{sec.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Upload New File</label>
                                <div className="relative border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                    />
                                    <Upload size={24} className="text-muted-foreground mb-2" />
                                    <span className="text-xs font-bold text-white">
                                        {selectedFile ? selectedFile.name : "Replace existing file attachment..."}
                                    </span>
                                    {uploadProgress !== null && (
                                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-4">
                                            <div 
                                                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Resource Link / File URL</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                                    value={editingMaterial.url}
                                    onChange={(e) => setEditingMaterial({ ...editingMaterial, url: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Description (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm min-h-[70px]"
                                    value={editingMaterial.description}
                                    onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={actionLoading || (uploadProgress !== null && uploadProgress < 100)}
                                className="w-full py-4 premium-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 text-sm"
                            >
                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Start Broadcast (Go Live) */}
            {showGoLive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-red-500/30">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-red-500">
                                <Radio className="animate-pulse" size={24} />
                                <h2 className="text-2xl font-extrabold text-white">Broadcast Live Lecture</h2>
                            </div>
                            <button onClick={() => setShowGoLive(false)} className="p-2 hover:bg-white/10 text-muted-foreground rounded-xl transition-all">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleGoLive} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">YouTube Live Stream URL</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-red-500 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={liveUrl}
                                    onChange={(e) => setLiveUrl(e.target.value)}
                                />
                                <p className="text-[11px] text-muted-foreground leading-normal mt-1.5">Paste your active YouTube Stream URL. It will automatically embed live inside the students' class feed instantly.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Broadcast"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Create Announcement */}
            {showAddNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-white">Post Class Announcement</h2>
                            <button onClick={() => setShowAddNotice(false)} className="p-2 hover:bg-white/10 text-muted-foreground rounded-xl transition-all">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateNotice} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Announcement Title (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                                    placeholder="e.g. Schedule Update"
                                    value={noticeTitle}
                                    onChange={(e) => setNoticeTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Message Content</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white placeholder:text-white/20 text-sm min-h-[120px]"
                                    placeholder="Write announcement details here..."
                                    value={noticeContent}
                                    onChange={(e) => setNoticeContent(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Announcement"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
