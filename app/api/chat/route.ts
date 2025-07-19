import { createAnthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { convertToModelMessages, streamText, UIMessage } from "ai";

const anthropic = createAnthropic({
    apiKey: process.env.CLAUDE_API_KEY,
    headers: {
        "anthropic-beta": "token-efficient-tools-2025-02-19"
    }
})

const model = anthropic("claude-3-sonnet-20240229")

export async function POST(req: Request) {

    const { messages, videoId }: { messages: UIMessage[], videoId: string } = await req.json()

    const result = streamText({
        model: google("gemini-2.5-pro", {
            apiKey: process.env.GOOGLE_API_KEY
        }),
        messages: convertToModelMessages(messages)
    })

    return result.toUIMessageStreamResponse()
} 