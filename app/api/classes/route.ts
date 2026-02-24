import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const MOCK_TEACHER_ID = "teacher-id-123"

export async function POST(req: Request) {
    try {
        // Bypass session check for dev
        const userId = MOCK_TEACHER_ID

        const { name, description } = await req.json()

        if (!name) {
            return NextResponse.json({ error: "Class name is required" }, { status: 400 })
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                description,
                teacherId: userId
            }
        })

        return NextResponse.json(newClass, { status: 201 })
    } catch (error) {
        console.error("Class creation error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        // Return all classes for browsing
        const classes = await prisma.class.findMany({
            include: {
                teacher: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json(classes)
    } catch (error) {
        console.error("Classes fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
