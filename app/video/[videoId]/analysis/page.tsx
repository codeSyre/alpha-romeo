"use client"

import { createOrGetVideo } from '@/actions/createOrGetVideo'
import AiAgentChat from '@/components/AiAgentChat'
import ThumbnailGeneration from '@/components/ThumbnailGeneration'
import TitleGenerations from '@/components/TitleGenerations'
import Transcriptions from '@/components/Transcriptions'
import Usage from '@/components/Usage'
import YouTubeVideoDetails from '@/components/YouTubeVideoDetails'
import { Doc } from '@/convex/_generated/dataModel'
import { FeatureFlag } from '@/features/flags'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function AnalysisPage() {
    const params = useParams()
    const {videoId} = params as {videoId: string}
    const {user} = useUser()
    const [video, setVideo] = useState<Doc<"videos"> | null | undefined>(undefined)

    useEffect(() => {
        if(!user?.id) return

        const fetchOrGetVideo = async () => {
            const response = await createOrGetVideo(videoId as string, user.id)

            if(!response.success) {
                console.error("Error fetching or creating video:", response.error)
            } else {
                setVideo(response.data!)
            }
        }
        fetchOrGetVideo()
    }, [videoId, user])

    const VidieoTranscriptionState = video === undefined ? (
        <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full'>
            <div className='w-2 h-2 bg-gray-400 rounded-full animate-pulse' />
            <span className='text-sm text-gray-700'>Loading...</span>
        </div>
    ) : !video ? (
        <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full'>
            <div className='w-2 h-2 bg-amber-400 rounded-full animate-pulse' />
            <p className='text-sm text-amber-700'>
                This is your first time analysing this video. <br />
                <span className='font-semibold'>(1 analysis token is being used!)</span>
            </p>
        </div>
    ) : (
        <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full'>
            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
            <p className='text-sm text-green-700'>
                This video has been analysed before. No additional tokens needed in future calls.<br />
            </p>
        </div>
    )

    return (
        <div className='xl:container mx-auto px-4 md:px-0'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {/* Left Side  */}
                <div className='order-2 lg:order-1 flex flex-col gap-4 bg-white lg:border-r border-gray-200 p-6'>
                    {/* Analysis Section  */}
                    <div className='flex flex-col gap-4 p-4 border border-gray-200 rounded-xl'>
                        <Usage
                        featureFlag={FeatureFlag.ANALYZE_VIDEO}
                        title='Analyze Video'
                        />

                        {/* Video transcription status  */}
                        {VidieoTranscriptionState}
                    </div>

                    {/* YouTube Video Details  */}
                    <YouTubeVideoDetails videoId={videoId} />

                    {/* Thumbnail Generation  */}
                    <ThumbnailGeneration videoId={videoId} />

                    {/* Title Generation  */}
                    <TitleGenerations videoId={videoId}/>

                    {/* Transcription  */}
                    <Transcriptions videoId={videoId}/>
                </div>

                {/* Right Side  */}
                <div className='order-1 lg:order-2 lg:sticky lg:top-20 h-[500px] md:h-[calc(100vh-6rem)]'>
                    {/* AI Agent Chat */}
                    <AiAgentChat videoId={videoId}/>
                </div>
            </div>
        </div>
    )
}
