"use client"

import { FeatureFlag } from '@/features/flags'
import { useSchematicEntitlement } from '@schematichq/schematic-react'
import React, { useState } from 'react'
import Usage from './Usage'

interface TranscriptEntry {
    text: string,
    timestamp: string
}

export default function Transcriptions() {
    const [transcript, setTranscript] = useState<{
        transcript: TranscriptEntry,
        cache: string
    } | null>(null)
    const { featureUsageExceeded } = useSchematicEntitlement(
        FeatureFlag.TRANSCRIPTION
    )
    return (
        <div className='flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4'>
            <Usage featureFlag={FeatureFlag.TRANSCRIPTION} title={"Transcriptions"} />

            {/* Transcriptions  */}
            {!featureUsageExceeded ? (
                <div className='flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4'>
                    {transcript ? (
                        transcript.transcript.map((entry: any, index: any) => {
                            <div key={index} className='flex gap-2'>
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
