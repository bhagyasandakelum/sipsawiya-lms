import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions as any)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const userId = session.user.id
        const userRole = session.user.role

        if (userRole !== "TEACHER" && userRole !== "ADMIN") {
            return NextResponse.json({ error: "Only teachers can post notices" }, { status: 403 })
        }

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
