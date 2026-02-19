"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, ArrowLeft, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"

export default function NewClassPage() {
    const [formData, setFormData] = useState({ name: "", description: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push("/dashboard/classes")
            } else {
                const data = await res.json()
                setError(data.error || "Failed to create class")
                setLoading(false)
            }
        } catch (err) {
            setError("Network error")
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 w-fit">
                <ArrowLeft size={18} />
                Back to Dashboard
            </Link>

            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-4">
                    <BookOpen size={32} />
                </div>
                <h1 className="text-3xl font-bold">Create New Class</h1>
                <p className="text-muted-foreground mt-2">Set up your virtual classroom and start sharing knowledge.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Class Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all placeholder:text-muted-foreground/30"
                        placeholder="e.g. Advanced Physics - 2026 Batch"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Description (Optional)</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all min-h-[120px] placeholder:text-muted-foreground/30"
                        placeholder="Describe what students will learn in this class..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 premium-gradient rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Initialize Classroom
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
