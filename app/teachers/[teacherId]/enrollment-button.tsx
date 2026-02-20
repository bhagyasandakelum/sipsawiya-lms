"use client"

import { useState } from "react"
import { Plus, Check, Loader2, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

interface EnrollmentButtonProps {
    classId: string
    isStudent: boolean
    isLoggedIn: boolean
    alreadyEnrolled: boolean
}

export default function EnrollmentButton({
    classId,
    isStudent,
    isLoggedIn,
    alreadyEnrolled
}: EnrollmentButtonProps) {
    const [loading, setLoading] = useState(false)
    const [enrolled, setEnrolled] = useState(alreadyEnrolled)
    const router = useRouter()

    const handleEnroll = async () => {
        if (!isLoggedIn) {
            router.push('/login')
            return
        }

        if (!isStudent) return

        setLoading(true)
        try {
            const res = await fetch("/api/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId }),
            })

            if (res.ok) {
                setEnrolled(true)
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || "Failed to enroll")
            }
        } catch (error: any) {
            alert("An error occurred during enrollment")
        } finally {
            setLoading(false)
        }
    }

    if (!isLoggedIn) {
        return (
            <button
                onClick={() => router.push('/login')}
                className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
            >
                <LogIn size={16} /> Sign In to Enroll
            </button>
        )
    }

    if (!isStudent) {
        return (
            <button
                disabled
                className="w-full py-3 bg-white/5 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed border border-white/5"
            >
                Students Only
            </button>
        )
    }

    if (enrolled) {
        return (
            <button
                disabled
                className="w-full py-3 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-emerald-500/20"
            >
                <Check size={16} /> Enrolled
            </button>
        )
    }

    return (
        <button
            onClick={handleEnroll}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <>
                    <Plus size={16} /> Enroll Now
                </>
            )}
        </button>
    )
}
