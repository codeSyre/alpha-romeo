import { z } from "zod";

export const videoDetailsSchema = z.object({
    // title: z.string(),
    // description: z.string(),
    // thumbnailUrl: z.string(),
    videoId: z.string().describe("The video ID to fetch the transcript for"),
    // channelTitle: z.string(),
    // channelId: z.string(),
    // publishedAt: z.string(),
})