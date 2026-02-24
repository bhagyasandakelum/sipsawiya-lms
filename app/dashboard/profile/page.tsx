"use client"

import { useState, useEffect } from "react"
import { User, Mail, Lock, BookOpen, GraduationCap, FileText, CheckCircle2, Loader2, Camera, Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        degree: "",
        subjects: "",
        showBio: true,
        showDegree: true,
        showSubjects: true,
        image: ""
    })
    const [message, setMessage] = useState({ type: "", text: "" })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile")
            const data = await res.json()
            if (res.ok) {
                setUser({ ...data, password: "" })
            }
        } catch (err) {
            console.error("Failed to fetch profile")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: "", text: "" })

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            })

            if (res.ok) {
                setMessage({ type: "success", text: "Profile updated successfully!" })
                setUser(prev => ({ ...prev, password: "" }))
            } else {
                setMessage({ type: "error", text: "Failed to update profile" })
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to connect to server" })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Account Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your profile and public presence</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {message.text && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="glass p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full premium-gradient flex items-center justify-center text-4xl font-bold overflow-hidden border-4 border-white/5 shadow-2xl">
                            {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : user.name[0]?.toUpperCase()}
                        </div>
                        <button
                            type="button"
                            className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-xl hover:scale-110 transition-all active:scale-95"
                            onClick={() => {
                                const url = prompt("Enter image URL:")
                                if (url) setUser({ ...user, image: url })
                            }}
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-1 text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4" /> {user.email}
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 premium-gradient rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="glass p-8 rounded-[2rem] space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                <User className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold">Personal Information</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 flex items-center justify-between">
                                    New Password
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">Leave empty to keep current</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all pl-11"
                                        placeholder="••••••••"
                                        value={user.password}
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visibility Settings */}
                    <div className="glass p-8 rounded-[2rem] space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                                <Eye className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold">Visibility Settings</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: "showBio", label: "Display Bio on Profile", icon: FileText },
                                { id: "showDegree", label: "Display Degree on Profile", icon: GraduationCap },
                                { id: "showSubjects", label: "Display Subjects on Profile", icon: BookOpen },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => setUser({ ...user, [item.id]: !user[item.id as keyof typeof user] })}>
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full transition-all relative ${user[item.id as keyof typeof user] ? 'bg-blue-600' : 'bg-white/10'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user[item.id as keyof typeof user] ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="glass p-8 rounded-[2rem] space-y-6 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold">Professional Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Highest Degree</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    value={user.degree || ""}
                                    placeholder="e.g. B.Sc. in Physics"
                                    onChange={(e) => setUser({ ...user, degree: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Subjects (comma separated)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    value={user.subjects || ""}
                                    placeholder="e.g. Mathematics, Physics"
                                    onChange={(e) => setUser({ ...user, subjects: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium ml-1">Short Bio</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none"
                                    value={user.bio || ""}
                                    placeholder="Tell your students about yourself..."
                                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
