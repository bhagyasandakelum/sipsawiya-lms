"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { GraduationCap, Loader2, CheckCircle, XCircle } from "lucide-react"
import api from "@/lib/api"

function VerifyEmailContent() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus("error")
                setMessage("Invalid verification link. No token provided.")
                return
            }

            try {
                const res = await api.get(`/auth/verify-email/${token}`)
                setStatus("success")
                setMessage(res.data.message || "Email verified successfully!")
            } catch (err: any) {
                setStatus("error")
                setMessage(
                    err.response?.data?.message || "Verification failed. The link may have expired."
                )
            }
        }

        verifyEmail()
    }, [token])

    return (
        <div className="glass p-8 rounded-3xl space-y-6 text-center">
            {status === "loading" && (
                <>
                    <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto" />
                    <p className="text-muted-foreground">Verifying your email address...</p>
                </>
            )}

            {status === "success" && (
                <>
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Email Verified!</h2>
                        <p className="text-muted-foreground text-sm">{message}</p>
                    </div>
                    <Link
                        href="/login?verified=true"
                        className="inline-block px-6 py-3 premium-gradient rounded-xl font-bold hover:scale-[1.02] transition-all"
                    >
                        Continue to Login
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                        <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
                        <p className="text-muted-foreground text-sm">{message}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="inline-block px-6 py-3 premium-gradient rounded-xl font-bold hover:scale-[1.02] transition-all"
                        >
                            Go to Login
                        </Link>
                        <p className="text-xs text-muted-foreground">
                            Need a new verification link? Log in and request a new one.
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default function VerifyEmailPage() {
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
                    <h1 className="text-2xl font-bold">Email Verification</h1>
                </div>

                <Suspense fallback={
                    <div className="glass p-8 rounded-3xl text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto" />
                        <p className="text-muted-foreground mt-4">Loading...</p>
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    )
}
