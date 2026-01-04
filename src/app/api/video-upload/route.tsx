import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number
    [key: string]: any
}

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(req: NextRequest) {

    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorzed', success: false }, { status: 401 })
    }

    try {

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;


        if (!file) {
            return NextResponse.json({ message: "File not found", success: false }, { status: 400 })
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "videos",
                    eager: [
                        {
                            quality: "auto",
                            fetch_format: "mp4",
                        },
                    ],
                    eager_async: true, // ✅ async processing
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );


            uploadStream.end(buffer)

        });

        console.log(result)

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
            }
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log("Error uploading video :: ", error)
        return NextResponse.json({ message: "Error uploading video", success: false }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

