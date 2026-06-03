"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { GraduationCap, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import api from "@/lib/api"

function ResetPasswordForm() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
        if (!passwordRegex.test(password)) {
            setError("Password must contain at least one uppercase, lowercase, number, and special character")
            return
        }

        if (!token) {
            setError("Invalid reset link. Please request a new password reset.")
            return
        }

        setLoading(true)

        try {
            await api.post("/auth/reset-password", { token, password })
            setSuccess(true)
            setTimeout(() => router.push("/login"), 3000)
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password. The link may have expired.")
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="glass p-8 rounded-3xl text-center space-y-4">
                <p className="text-red-400">Invalid reset link. Please request a new password reset.</p>
                <Link href="/forgot-password" className="text-blue-400 hover:underline text-sm font-medium">
                    Request New Reset Link
                </Link>
            </div>
        )
    }

    return (
        <>
            {success ? (
                <div className="glass p-8 rounded-3xl space-y-6 text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Password Reset Successful</h2>
                        <p className="text-muted-foreground text-sm">
                            Your password has been updated. Redirecting to login...
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">New Password</label>
                        <input
                            id="reset-password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground ml-1">
                            Min 8 chars, with uppercase, lowercase, number & special character
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Confirm New Password</label>
                        <input
                            id="reset-confirm-password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="reset-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 premium-gradient rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                    </button>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors pt-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </form>
            )}
        </>
    )
}

export default function ResetPasswordPage() {
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
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground mt-2">Create a new secure password</p>
                </div>

                <Suspense fallback={<div className="glass p-8 rounded-3xl text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
