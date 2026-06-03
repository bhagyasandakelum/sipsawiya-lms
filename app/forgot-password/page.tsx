"use client"

import { useState } from "react"
import Link from "next/link"
import { GraduationCap, ArrowLeft, Loader2, Mail } from "lucide-react"
import api from "@/lib/api"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await api.post("/auth/forgot-password", { email })
            setSent(true)
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full" />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <GraduationCap className="w-10 h-10 text-blue-400" />
                        <span className="text-3xl font-bold tracking-tight">Sipsawiya</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <p className="text-muted-foreground mt-2">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {sent ? (
                    <div className="glass p-8 rounded-3xl space-y-6 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                            <Mail className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                            <p className="text-muted-foreground text-sm">
                                If an account with <strong className="text-white">{email}</strong> exists,
                                we've sent a password reset link. Please check your inbox and spam folder.
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-blue-400 hover:underline text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-5">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Email Address</label>
                            <input
                                id="forgot-email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 premium-gradient rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                        </button>

                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors pt-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    )
}
