"use client"

import AiAgentChat from '@/components/AiAgentChat'
import ThumbnailGeneration from '@/components/ThumbnailGeneration'
import TitleGenerations from '@/components/TitleGenerations'
import Transcriptions from '@/components/Transcriptions'
import Usage from '@/components/Usage'
import YouTubeVideoDetails from '@/components/YouTubeVideoDetails'
import { FeatureFlag } from '@/features/flags'
import { useParams } from 'next/navigation'
import React from 'react'

export default function AnalysisPage() {
    const params = useParams()
    const {videoId} = params as {videoId: string}

    return (
        <div className='xl:container mx-auto px-4 md:px-0'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {/* Left Side  */}
                <div className='order-2 lg:order-1 flex flex-col gap-4 bg-white lg:border-r border-gray-200 p-6'>
                    {/* Analysis Section  */}
                    <div>
                        <Usage
                        featureFlag={FeatureFlag.ANALYZE_VIDEO}
                        title='Analyze Video'
                        />

                        {/* Video transcription status  */}
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
