import { NextRequest, NextResponse } from "next/server";

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })


const prisma = new PrismaClient({ adapter })

export async function GET(req: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(videos)
    } catch (error) {
        console.log('Error fetching videos :: ', error)
        return NextResponse.json({ error: "Error fetching videos", success: false }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}