"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()

    const registered = searchParams.get("registered")
    const verified = searchParams.get("verified")
    const sessionExpired = searchParams.get("session")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await login(email, password)
            router.push("/dashboard")
            router.refresh()
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "Invalid email or password"
            setError(message)
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
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-5">
                    {/* Status messages */}
                    {registered && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl text-center">
                            Registration successful! You can now sign in.
                        </div>
                    )}
                    {verified && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl text-center">
                            Email verified successfully! You can now sign in.
                        </div>
                    )}
                    {sessionExpired === "expired" && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm rounded-xl text-center">
                            Your session has expired. Please sign in again.
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Email Address</label>
                        <input
                            id="login-email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium ml-1">Password</label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-blue-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="login-password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 premium-gradient rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <p className="text-center text-sm text-muted-foreground pt-2">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-400 font-medium hover:underline">
                            Register now
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
