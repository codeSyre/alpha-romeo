"use client"

import { FeatureFlag } from '@/features/flags'
import { useSchematicEntitlement } from '@schematichq/schematic-react'
import React, { useCallback, useEffect, useState } from 'react'
import Usage from './Usage'
import { getYoutubeTranscript } from '@/actions/getYoutubeTranscript'

interface TranscriptEntry {
    text: string,
    timestamp: string
}

export default function Transcriptions({ videoId }: { videoId: string }) {
    const [transcript, setTranscript] = useState<{
        transcript: TranscriptEntry[],
        cache: string
    } | null>(null)

    const { featureUsageExceeded } = useSchematicEntitlement(
        FeatureFlag.TRANSCRIPTION
    )

    const handleGenerateTranscript = useCallback(
        async (videoId: string) => {
            if (featureUsageExceeded) {
                console.log("Feature usage exceeded")
                return
            }

            const result = await getYoutubeTranscript(videoId)
            setTranscript(result as any)
        }, [featureUsageExceeded])

    useEffect(() => {
        handleGenerateTranscript(videoId)
    }, [handleGenerateTranscript, videoId])

    return (
        <div className='p-4 border border-gray-200 rounded-xl bg-white'>
            <div className='min-w-52 mb-10'>
                <Usage featureFlag={FeatureFlag.TRANSCRIPTION} title={"Transcriptions"} />
            </div>

            {/* Transcriptions  */}
            {!featureUsageExceeded ? (
                <div className='flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4 border-2 border-dashed border-gray-200'>
                    {transcript ? (
                        transcript.transcript.map((entry: TranscriptEntry, index: number) => {
                            return <div key={index} className='flex gap-2'>
                                <span className='text-sm text-gray-400 min-w-[50px]'>
                                    {entry.timestamp}
                                </span>
                                <p className='text-sm text-gray-700'>{entry.text}</p>
                            </div>
                        })
                    ) : (
                        <p className='text-sm text-gray-700'>No transcriptions available.</p>
                    )}
                </div>
            ) : null}
        </div>
    )
}
