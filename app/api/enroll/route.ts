import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions as any)

        if (!session || session.user.role !== "STUDENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { classId } = await req.json()

        if (!classId) {
            return NextResponse.json({ error: "Class ID is required" }, { status: 400 })
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                studentId: session.user.id,
                classId
            }
        })

        return NextResponse.json(enrollment, { status: 201 })
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: "Already enrolled in this class" }, { status: 400 })
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
