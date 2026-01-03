import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

interface uploadResult {
    public_id: string
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

        if (!file) {
            return NextResponse.json({ message: "File not found", success: false }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<uploadResult>((resolve, reject) => {

            cloudinary.uploader.upload_stream({ folder: 'images' }, (err, uploadResult) => {
                if (err) return reject(err)
                return resolve(uploadResult as uploadResult);
            }).end(buffer)

        })

        return NextResponse.json({ publicId: result.public_id, success: true }, { status: 200 });

    } catch (error) {
        console.log("Error uploading image :: ", error)
        return NextResponse.json({ message: "Error uploading image", success: false }, { status: 500 })
    }

}
