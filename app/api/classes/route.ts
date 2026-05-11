import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions as any)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        let userId = session.user.id
        let userRole = session.user.role

        // Fallback if session token doesn't have id/role
        if (!userId) {
            const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
            if (!dbUser) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }
            userId = dbUser.id
            userRole = dbUser.role
        }

        if (userRole !== "TEACHER" && userRole !== "ADMIN") {
            return NextResponse.json({ error: "Only teachers can create classes" }, { status: 403 })
        }

        const { name, description, year, thumbnail } = await req.json()

        if (!name) {
            return NextResponse.json({ error: "Class name is required" }, { status: 400 })
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                description,
                year,
                thumbnail,
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

        let userRole = session?.user?.role
        let userId = session?.user?.id

        if (session?.user?.email && !userId) {
            const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
            if (dbUser) {
                userId = dbUser.id
                userRole = dbUser.role
            }
        }

        const url = new URL(req.url)
        const query = url.searchParams.get("q") || ""

        let whereClause: any = {}
        
        // Only restrict to teacher's own classes if not doing a global search, or if that was the intended behavior.
        // Wait, if it's the dashboard it might need different logic.
        // Actually, the previous code always restricted TEACHER to their own classes.
        // Let's keep it restricted, but add the query.
        if (userRole === "TEACHER" && userId) {
            whereClause.teacherId = userId
        }

        if (query) {
            whereClause.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { teacher: { name: { contains: query, mode: 'insensitive' } } }
            ]
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
