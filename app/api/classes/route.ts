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
        const userRole = session.user.role

        if (userRole !== "TEACHER" && userRole !== "ADMIN") {
            return NextResponse.json({ error: "Only teachers can create classes" }, { status: 403 })
        }

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
        const session: any = await getServerSession(authOptions as any)
        const userRole = session?.user?.role
        const userId = session?.user?.id

        let whereClause = {}
        if (userRole === "TEACHER" && userId) {
            whereClause = { teacherId: userId }
        }

        const classes = await prisma.class.findMany({
            where: whereClause,
            include: {
                teacher: {
                    select: { name: true }
                },
                materials: true,
                enrollments: true
            }
        })

        return NextResponse.json(classes)
    } catch (error) {
        console.error("Classes fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
