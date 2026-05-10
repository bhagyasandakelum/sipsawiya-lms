import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const userId = session.user.id

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Profile fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const userId = session.user.id
        const data = await req.json()

        const updateData: any = {
            name: data.name,
            bio: data.bio,
            degree: data.degree,
            subjects: data.subjects,
            showBio: data.showBio,
            showDegree: data.showDegree,
            showSubjects: data.showSubjects,
            image: data.image
        }

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10)
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
