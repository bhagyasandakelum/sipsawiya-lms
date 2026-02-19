import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions as any)

        if (!session || session.user.role !== "TEACHER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { title, description, type, url, classId } = await req.json()

        if (!title || !type || !url || !classId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Check if the teacher owns the class
        const classExists = await prisma.class.findFirst({
            where: {
                id: classId,
                teacherId: session.user.id
            }
        })

        if (!classExists) {
            return NextResponse.json({ error: "Class not found or not owned by you" }, { status: 403 })
        }

        const material = await prisma.material.create({
            data: {
                title,
                description,
                type,
                url,
                classId
            }
        })

        return NextResponse.json(material, { status: 201 })
    } catch (error) {
        console.error("Material creation error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
