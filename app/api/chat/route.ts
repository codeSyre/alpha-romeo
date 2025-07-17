import { createAnthropic } from "@ai-sdk/anthropic";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { streamText } from "ai";

const anthropic = createAnthropic({
    apiKey: process.env.CLAUDE_API_KEY,
    headers: {
        "anthropic-beta": "token-efficient-tools-2025-02-19"
    }
})

const model = anthropic("claude-3-sonnet-20240229")

export async function POST(req: Request) {

    const { messages, videoId } = await req.json()

    const result = streamText({
        model,
        messages
    })

    console.log("result :::: ", result.toDataStreamResponse())

    return result.toDataStreamResponse()
} 