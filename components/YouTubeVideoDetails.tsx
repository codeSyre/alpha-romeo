'use client'

import { getVideoDetails } from '@/actions/getVideoDetails'
import { VideoDetails } from '@/types/types'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Eye, LucideCalendarFold, MessageCircle, ThumbsUp } from 'lucide-react'

export default function YouTubeVideoDetails({ videoId }: { videoId: any }) {
    const [video, setVideo] = useState<VideoDetails | null>(null)

    useEffect(() => {
        const fetchVideoDetails = async () => {
            const video = await getVideoDetails(videoId)
            setVideo(video)
        }

        fetchVideoDetails()
    }, [videoId])

    if (!video) return <div className='flext justify-center items-center p-4'>
        <div className='w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin'>
        </div>
    </div>

    return (
        <div className='@container bg-white rounded-xl'>
            <div className='flex flex-col gap-6'>

                {/* Video Thumbnail  */}
                <div className='flex-shrink-0'>
                    <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={500}
                        height={500}
                        className='w-full rounded-xl'
                    />
                </div>

                {/* Video Details  */}
                <div className='flex-grow space-y-4'>
                    <h1 className='text-2xl @lg:text-3xl font-bold text-gray-900'>
                        {video.title}
                    </h1>

                    {/* Channel Info  */}
                    <div className='flex items-center gap-4'>
                        <Image
                            src={video.channel.thumbnail}
                            alt={video.channel.title}
                            width={500}
                            height={500}
                            className='w-10 h-10 @md:w-12 @md:h-12 rounded-full border-2 border-gray-100'
                        />
                        <div>
                            <p className='text-base @md:text-lg font-semibold text-gray-900'>{video.channel.title}</p>
                            <p className='text-sm text-gray-600'>{video.channel.subscribers} subscribers</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 @lg:grid-cols-4 gap-4 pt-4'>
                        <div className='bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100'>
                            <div className='flex items-center gap-2 mb-1'>
                                <LucideCalendarFold className='w-4 h-4 text-gray-600' />
                                <p className='text-sm text-gray-600'>Published</p>
                            </div>
                            <p className='font-medium text-gray-900'>
                                {new Date(video.publishedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className='bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100'>
                            <div className='flex items-center gap-2 mb-1'>
                                <Eye className='w-4 h-4 text-gray-600' />
                                <p className='text-sm text-gray-600'>Views</p>
                            </div>
                            <p className='font-medium text-gray-900'>
                                {video.views}
                            </p>
                        </div>
                        <div className='bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100'>
                            <div className='flex items-center gap-2 mb-1'>
                                <MessageCircle className='w-4 h-4 text-gray-600' />
                                <p className='text-sm text-gray-600'>Comments</p>
                            </div>
                            <p className='font-medium text-gray-900'>
                                {video.comments}
                            </p>
                        </div>
                        <div className='bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100'>
                            <div className='flex items-center gap-2 mb-1'>
                                <ThumbsUp className='w-4 h-4 text-gray-600' />
                                <p className='text-sm text-gray-600'>Likes</p>
                            </div>
                            <p className='font-medium text-gray-900'>
                                {video.likes}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
