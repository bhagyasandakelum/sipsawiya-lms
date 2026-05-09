import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions as any)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const userId = session.user.id

        const { title, description, section, type, url, classId } = await req.json()

        if (!title || !type || !url || !classId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Admin might be able to bypass this, but for now just check teacher ownership or if Admin
        const userRole = session.user.role;
        let classExists;

        if (userRole === "ADMIN") {
            classExists = await prisma.class.findUnique({ where: { id: classId } });
        } else {
            classExists = await prisma.class.findFirst({
                where: {
                    id: classId,
                    teacherId: userId
                }
            })
        }

        if (!classExists) {
            return NextResponse.json({ error: "Class not found or not owned by you" }, { status: 403 })
        }

        const material = await prisma.material.create({
            data: {
                title,
                description,
                section,
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

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
        return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    try {
        const session: any = await getServerSession(authOptions as any)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        
        const material = await prisma.material.findUnique({
            where: { id },
            include: { class: true }
        })

        if (!material) {
            return NextResponse.json({ error: "Material not found" }, { status: 404 })
        }

        if (session.user.role !== "ADMIN" && material.class.teacherId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        await prisma.material.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Material delete error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
