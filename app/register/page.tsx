"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, ArrowRight, Loader2, User, BookOpen } from "lucide-react"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                router.push("/login?registered=true")
            } else {
                setError(data.error || "Something went wrong")
                setLoading(false)
            }
        } catch (err) {
            setError("Failed to connect to server")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full" />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <GraduationCap className="w-10 h-10 text-blue-400" />
                        <span className="text-3xl font-bold tracking-tight">Sipsawiya</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-muted-foreground mt-2">Join Sipsawiya today and start your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "STUDENT" })}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.role === "STUDENT"
                                        ? "bg-blue-600/20 border-blue-500 text-blue-400"
                                        : "bg-white/5 border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <User className="w-4 h-4" /> Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "TEACHER" })}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.role === "TEACHER"
                                        ? "bg-purple-600/20 border-purple-500 text-purple-400"
                                        : "bg-white/5 border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <BookOpen className="w-4 h-4" /> Teacher
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 premium-gradient rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <p className="text-center text-sm text-muted-foreground pt-2">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-400 font-medium hover:underline">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
