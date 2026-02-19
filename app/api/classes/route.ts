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

        const { name, description } = await req.json()

        if (!name) {
            return NextResponse.json({ error: "Class name is required" }, { status: 400 })
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                description,
                teacherId: session.user.id
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
        const session = await getServerSession(authOptions as any)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // If teacher, return their classes. If student, return all classes (for browsing).
        // Or we could have different endpoints. Let's make this one for browsing.
        const classes = await prisma.class.findMany({
            include: {
                teacher: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json(classes)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
