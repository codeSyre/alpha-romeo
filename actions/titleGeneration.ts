"use server"

import { api } from "@/convex/_generated/api"
import { FeatureFlag, featureFlagEvents } from "@/features/flags"
import { getConvexClient } from "@/lib/convex"
import { client } from "@/lib/schematic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { currentUser } from "@clerk/nextjs/server"
import { generateText } from "ai"
// import OpenAI from "openai"

const convexClient = getConvexClient()

export async function titleGeneration(videoId: string, videoSummary: string, considerations: string) {
    const user = await currentUser()

    if (!user?.id) {
        throw new Error("User not found")
    }

    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
    })

    // const openai = new OpenAI({
    //     apiKey: process.env.OPENAI_API_KEY
    // })

    try{
        console.log("Video sumary: ", videoSummary)
        console.log("Generating title for videoID: ", videoId)
        console.log("Considerations: ", considerations)

        // const response = await openai.chat.completions.create({
        //   model: "o4-mini",
        //   messages: [
        //     {
        //         role: "system",
        //         content: "You are a helpful YouTube video creator assistant that creates high quality SEO friendly consice video titles."
        //     },
        //     {
        //         role: "user",
        //         content: `Please provide ONE consice YouTube title (and nothing else) for this video. Focus on the main points and key takeaways. It should be SEO friendly and 100 characters or less:\n\n${videoSummary}\n\n${considerations}`
        //     }
        //   ],
        //   temperature: 0.7,
        //   max_tokens: 500
        // })

        const res = await generateText({
            model: google("gemini-2.5-pro"),
            messages: [
                {
                    role: "system",
                    content: "You are a helpful YouTube video creator assistant that creates high quality SEO friendly consice video titles."
                },
                {
                    role: "user",
                    content: `Please provide ONE consice YouTube title (and nothing else) for this video. Focus on the main points and key takeaways. It should be SEO friendly and 100 characters or less:\n\n${videoSummary}\n\n${considerations}`
                }
              ],
        })

        console.log("[Gemini]: ", res.text)

        // const title = response.choices[0]?.message.content || "Unable to generate title"
        const title = res.text || "Unable to generate title"

        if(!title){
            return {
                error: "Failed to generate title (System Error)"
            }
        }

        await convexClient.mutation(api.titles.generate, {
            videoId,
            userId: user.id,
            title: title
        })

        await client.track({
            event: featureFlagEvents[FeatureFlag.TITLE_GENERATION].event,
            company:{
                id: user.id
            },
            user: {
                id: user.id
            }
        })

        console.log("Generated title: ", title)

        return title
    } catch(e){
        console.error("Error: ", e)
        throw new Error("Failed to generate title")
    }
}