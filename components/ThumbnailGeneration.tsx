"use client"

import { useUser } from '@clerk/nextjs'
import React from 'react'
import Usage from './Usage'
import { FeatureFlag } from '@/features/flags'
import Image from 'next/image'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function ThumbnailGeneration({ videoId }: { videoId: string }) {
    const user = useUser()

    const images: any = useQuery(api.images.getImages, {
        videoId,
        userId: user?.user?.id ?? ""
    })
    return (
        <div className='rounded-xl flex flex-col p-4 border'>
            <div className='min-w-52'>
                <Usage featureFlag={FeatureFlag.IMAGE_GENERATION} title={'Thumbnail Generation'} />
            </div>
            
            {/* Simple horizontal scroll of images  */}
            <div className={`flex overflow-x-auto gap-4 ${images?.length && "mt-4"}`}>
                {images?.map((image: any)=>{
                    image.url && (
                        <div key={image._id} className='flex-none w-[200px] h-[110px] rounded-lg overflow-x-auto'>
                            <Image
                        src={image.url}
                        alt={image.title}
                        width={200}
                        height={200}
                        className='object-cover'
                    />
                        </div>
                    )
                })}
            </div>

            {/* No images generated yet  */}
            {!images?.length && (
                <div className='text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200'>
                    <p className='text-gray-500'>No thumbnails have been generated yet.</p>
                    <p className='text-sm text-gray-400 mt-1'>
                        Generate thumbnails to see them appear here
                    </p>
                </div>
            )}
        </div>
    )
}
