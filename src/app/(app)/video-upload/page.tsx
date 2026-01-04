'use client'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const VideoUpload: React.FC = () => {

    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)

    const MAX_FILE_SIZE = 70 * 1024 * 1024;

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert("File size too large")
            return;
        }

        try {

            setIsUploading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("originalSize", file.size.toString());

            await axios.post("/api/video-upload", formData)
            router.push("/")
        } catch (error: any) {
            alert(error.response.data.message)
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="container mx-auto p-4 text-white ">
            <h1 className="text-2xl font-bold mb-8">Upload Video</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
                <div>
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full outline-0"
                        required

                    />
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered w-full outline-0"
                    />
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Video File</span>
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="file-input file-input-bordered w-full outline-0"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-active btn-accent my-4"
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload Video"}
                </button>
            </form>
        </div>
    );
}

export default VideoUpload


