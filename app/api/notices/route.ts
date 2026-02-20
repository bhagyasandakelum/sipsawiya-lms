import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions as any)

        if (!session || (session as any).user.role !== "TEACHER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { content } = await req.json()

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }

        const notice = await prisma.notice.create({
            data: {
                content,
                teacherId: (session as any).user.id
            }
        })

        return NextResponse.json(notice)
    } catch (error) {
        console.error("Error creating notice:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
