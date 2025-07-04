'use server'

import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl"
import { redirect } from "next/navigation"

export async function AnalyzeLink(formData: FormData){
    const url = formData.get('url')?.toString()

    if(!url) return

    const videoId = getVideoIdFromUrl(url)

    console.log("Video ID: ", videoId);

    if(!videoId) return

    redirect(`/video/${videoId}/analysis`)
}