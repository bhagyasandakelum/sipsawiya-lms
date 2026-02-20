import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { name, email, password, role, degree, subjects } = await req.json()

        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role.toUpperCase() === "TEACHER" ? "TEACHER" : "STUDENT",
                degree: role.toUpperCase() === "TEACHER" ? degree : null,
                subjects: role.toUpperCase() === "TEACHER" ? subjects : null,
            }
        })

        return NextResponse.json({ message: "User created successfully" }, { status: 201 })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
