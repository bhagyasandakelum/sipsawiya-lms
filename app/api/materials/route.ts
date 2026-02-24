import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const MOCK_TEACHER_ID = "teacher-id-123"

export async function POST(req: Request) {
    try {
        const userId = MOCK_TEACHER_ID

        const { title, description, type, url, classId } = await req.json()

        if (!title || !type || !url || !classId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Check if the teacher owns the class
        const classExists = await prisma.class.findFirst({
            where: {
                id: classId,
                teacherId: userId
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

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get("classId")

    if (!classId) {
        return NextResponse.json({ error: "classId is required" }, { status: 400 })
    }

    try {
        const materials = await prisma.material.findMany({
            where: { classId }
        })
        return NextResponse.json(materials)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
