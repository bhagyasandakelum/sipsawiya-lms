import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        
        const userId = session.user.id
        const { classId } = await req.json()

        if (!classId) {
            return NextResponse.json({ error: "Class ID is required" }, { status: 400 })
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                studentId: userId,
                classId
            }
        })

        return NextResponse.json(enrollment, { status: 201 })
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: "Already enrolled in this class" }, { status: 400 })
        }
        console.error("Enrollment error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
