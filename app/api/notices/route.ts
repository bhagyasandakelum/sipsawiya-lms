import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const MOCK_TEACHER_ID = "teacher-id-123"

export async function POST(req: Request) {
    try {
        const userId = MOCK_TEACHER_ID
        const { content } = await req.json()

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }

        const notice = await prisma.notice.create({
            data: {
                content,
                teacherId: userId
            }
        })

        return NextResponse.json(notice)
    } catch (error) {
        console.error("Error creating notice:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const notices = await prisma.notice.findMany({
            include: {
                teacher: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(notices)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
