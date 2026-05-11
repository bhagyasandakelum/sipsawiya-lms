import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const query = url.searchParams.get("q") || ""

        let whereClause: any = { role: "TEACHER" }

        if (query) {
            whereClause.OR = [
                { name: { contains: query, mode: "insensitive" } },
                { subjects: { contains: query, mode: "insensitive" } }
            ]
        }

        const teachers = await prisma.user.findMany({
            where: whereClause,
            include: { taughtClasses: true }
        })

        return NextResponse.json(teachers)
    } catch (error) {
        console.error("Teachers fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
