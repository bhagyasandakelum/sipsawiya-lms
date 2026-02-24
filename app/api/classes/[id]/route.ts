import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        const classData = await prisma.class.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: { name: true, image: true, degree: true }
                },
                materials: {
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!classData) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 })
        }

        return NextResponse.json(classData)
    } catch (error) {
        console.error("Class fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
