'use server'

import { VideoDetails } from "@/types/types"
import { google } from "googleapis"

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY
})

if(!process.env.YOUTUBE_API_KEY){
    throw new Error("A YouTube API Key is required.")
}

export async function getVideoDetails(videoId: string){
    try{
        const videoResponse = await youtube.videos.list({
            part: ["statistics", "snippet"],
            id: [videoId]
        })

        const videoDetails = videoResponse.data.items?.[0]

        if(!videoDetails) throw new Error("Video not found.")

        const channelResponse = await youtube.channels.list({
            part: ["statistics", "snippet"],
            id: [videoDetails.snippet?.channelId || ""],
            key: process.env.YOUTUBE_API_KEY
        })

        const channelDetails = channelResponse.data.items?.[0]

        const video: VideoDetails = {
            // Video Info 
            title: videoDetails.snippet?.title || "unknown Title",
            thumbnail:
            videoDetails.snippet?.thumbnails?.maxres?.url ||
            videoDetails.snippet?.thumbnails?.high?.url ||
            videoDetails.snippet?.thumbnails?.default?.url ||
            "",
            publishedAt: videoDetails.snippet?.publishedAt || new Date().toISOString(),

            // Video Metrics 
            views: videoDetails.statistics?.viewCount || "0",
            likes: videoDetails.statistics?.likeCount || "Not available",
            comments: videoDetails.statistics?.commentCount || "Not available",

            // Channel Info 
            channel: {
                title: videoDetails.snippet?.channelTitle || "Unknown channel",
                thumbnail: channelDetails?.snippet?.thumbnails?.default?.url || "",
                subscribers: channelDetails?.statistics?.subscriberCount || "0"
            }
        }

        return video

    } catch(e: any){
        console.error("Error fetching video details.", e)
        return null
    }
}