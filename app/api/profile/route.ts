import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
    try {
        // In a real app, we'd get the ID from the session
        // For now, we use the mock teacher ID
        const userId = "teacher-id-123"

        let user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            // Create the mock user if it doesn't exist
            user = await prisma.user.create({
                data: {
                    id: userId,
                    name: "Dev Teacher",
                    email: "teacher@example.com",
                    password: await bcrypt.hash("password123", 10),
                    role: "TEACHER",
                    degree: "B.Sc. in Computer Science",
                    subjects: "Mathematics, Physics",
                    bio: "Experienced teacher with a passion for education.",
                }
            })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Profile fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const userId = "teacher-id-123"
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
