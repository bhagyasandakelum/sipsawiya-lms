import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const MOCK_STUDENT_ID = "student-id-123"

export async function POST(req: Request) {
    try {
        const userId = MOCK_STUDENT_ID
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
