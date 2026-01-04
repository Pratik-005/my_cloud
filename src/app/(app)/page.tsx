'use client'
import VideoCard from '@/src/components/VideoCard';
import { Video } from '@/src/types'
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react'
import download from 'downloadjs'

const Home: React.FC = () => {

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
            const res = await axios.get('/api/videos');
            setVideos(res.data)
        } catch (error) {
            setError("Failed to fetch videos")
        } finally {
            setLoading(false)
        }
    }, [])

    const handleDownload = async (url: string, title: string) => {
        const res = await fetch(url);
        const blob = await res.blob();
        download(blob, `${title}.mp4`, "video/mp4");
    }

    useEffect(() => { fetchVideos() }, []);

    if (loading) return (
        <div className='flex items-center justify-center h-screen text-white' >
            Loading ...
        </div>
    )

    return (
        <div className="container mx-auto p-4 text-white h-full">
            <h1 className="text-2xl font-bold mb-4">Videos</h1>
            {videos.length === 0 ? (
                <div className="text-center text-lg text-gray-500 h-full">
                    No videos available
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        videos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onDownload={handleDownload}
                            />
                        ))
                    }
                </div>
            )}
        </div>
    );
}

export default Home



