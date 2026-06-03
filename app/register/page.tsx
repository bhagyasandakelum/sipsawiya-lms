"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, ArrowRight, Loader2, User, BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT" as "STUDENT" | "TEACHER",
        // Student fields
        institution: "",
        academicLevel: "",
        // Teacher fields
        qualification: "",
        experience: "",
        specialization: "",
        bio: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { register } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters")
            setLoading(false)
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
        if (!passwordRegex.test(formData.password)) {
            setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
            setLoading(false)
            return
        }

        try {
            const { confirmPassword, ...registerData } = formData
            await register(registerData)
            router.push("/login?registered=true")
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "Something went wrong"
            setError(message)
            setLoading(false)
        }
    }

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
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
                            id="register-name"
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Email Address</label>
                        <input
                            id="register-email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground ml-1">
                            Min 8 chars, with uppercase, lowercase, number & special character
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Confirm Password</label>
                        <input
                            id="register-confirm-password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => updateField("confirmPassword", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => updateField("role", "STUDENT")}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.role === "STUDENT"
                                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <User className="w-4 h-4" /> Student
                            </button>
                            <button
                                type="button"
                                onClick={() => updateField("role", "TEACHER")}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.role === "TEACHER"
                                    ? "bg-purple-600/20 border-purple-500 text-purple-400"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <BookOpen className="w-4 h-4" /> Teacher
                            </button>
                        </div>
                    </div>

                    {/* Student-specific fields */}
                    {formData.role === "STUDENT" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Institution</label>
                                <input
                                    id="register-institution"
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. University of Colombo"
                                    value={formData.institution}
                                    onChange={(e) => updateField("institution", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Academic Level</label>
                                <input
                                    id="register-academic-level"
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Undergraduate, A/L"
                                    value={formData.academicLevel}
                                    onChange={(e) => updateField("academicLevel", e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {/* Teacher-specific fields */}
                    {formData.role === "TEACHER" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Qualification</label>
                                <input
                                    id="register-qualification"
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. B.Sc. in Physics"
                                    value={formData.qualification}
                                    onChange={(e) => updateField("qualification", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Experience</label>
                                <input
                                    id="register-experience"
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. 5 years"
                                    value={formData.experience}
                                    onChange={(e) => updateField("experience", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Specialization</label>
                                <input
                                    id="register-specialization"
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Combined Mathematics"
                                    value={formData.specialization}
                                    onChange={(e) => updateField("specialization", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Bio</label>
                                <textarea
                                    id="register-bio"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Tell students about yourself..."
                                    value={formData.bio}
                                    onChange={(e) => updateField("bio", e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <button
                        id="register-submit"
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
