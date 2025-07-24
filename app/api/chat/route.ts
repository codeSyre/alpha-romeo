import { createAnthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { getVideoDetails } from "@/actions/getVideoDetails";
import fetchTranscript from "@/tools/fetchTranscript";
import z from "zod";
import { getYoutubeTranscript } from "@/actions/getYoutubeTranscript";

export async function POST(req: Request) {
    const user = await currentUser()
    if(!user) {
        return new Response("Unauthorized", { status: 401 })
    }

    const { messages, videoId }: { messages: UIMessage[], videoId: string } = await req.json()

    const videDetails = await getVideoDetails(videoId)

    const systemMessage = `
    You are Alpha Romeo, a helpful assistant or AI Agent ready to accept questions from ${user.firstName}, the user, about ONE specific video. The video ID in question is ${videoId} but you will refer to it as ${videDetails?.title}. Use emojis to make the conversation more engaging and fun. If an error occurs, explain it to the user in a manner that they will understand. Try and fix the error but if you fail 3 times, say "I'm sorry, I'm having trouble understanding you. Please try again later." If the error suggests the user to upgrade, explain to the user that they must upgrade to the required plan to be able to use the feature in question. Tell them to navigate the Manage Plan page to upgrade. If a tool is used, analyze the response and if contains any cache, explain that the transcript is cached because they previously transcribed the video saving the user a token. Use words like database instead of cache to make more easy to understand. Format for notion.
    `

    const result = streamText({
        model: google("gemini-2.5-pro", {
            apiKey: process.env.GOOGLE_API_KEY
        }),
        messages: [
            {
                role: "system", 
                content: systemMessage
            },
            ...convertToModelMessages(messages)
        ],
        tools: {
            fetchTranscript: tool({
                name: 'fetchTranscript',
                description: "Fetch the transcript of a youtube video in segments",
                inputSchema: z.object({
                    videoId: z.string().describe("The YouTube video ID to fetch transcript for")
                }),
                execute: async ({ videoId }) => {
                    
                    const transcript = await getYoutubeTranscript(videoId);
                    return {
                        cache: transcript.cache,
                        transcript: transcript.transcript,
                    };
                }
            })
        }
    })

    return result.toUIMessageStreamResponse()
} 