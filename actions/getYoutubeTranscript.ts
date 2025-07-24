'use server'

import { api } from "@/convex/_generated/api"
import { FeatureFlag, featureFlagEvents } from "@/features/flags"
import { client } from "@/lib/schematic"
import { currentUser } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { Innertube } from "youtubei.js"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export interface TranscriptEntry {
    text: string
    timestamp: string
}

const youtube = await Innertube.create({
    lang: "en",
    location: "US",
})

function formatTimestamp(start_ms: number) {
    const minutes = Math.floor(start_ms / 60000)
    const seconds = Math.floor((start_ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

async function fetchTranscript(videoId: string): Promise<TranscriptEntry[]> {
    try {
        const info = await youtube.getInfo(videoId);
        const transcriptData = await info.getTranscript();

        const transcript: TranscriptEntry[] = transcriptData.transcript.content?.body?.initial_segments.map((segments) => {
            return {
                text: segments.snippet.text ?? "No text available",
                timestamp: formatTimestamp(Number(segments.start_ms))
            };
        }) || [];

        return transcript;

    } catch (error) {
        throw error;
    }
}

export async function getYoutubeTranscript(videoId: string) {
    console.log("[getYoutubeTranscript] Called with videoId:", videoId);

    const user = await currentUser();
    if (!user?.id) {
        console.log("[getYoutubeTranscript] No user found or user not authenticated.");
        return new Response("Unauthorized", { status: 401 });
    }
    console.log("[getYoutubeTranscript] User authenticated:", user.id);

    // Check if the transcript is cached
    console.log("[getYoutubeTranscript] Checking if transcript is already in the database...");
    const existingTranscript = await convex.query(
        api.transcript.getTranscriptByVideoId, {
        videoId, userId: user.id
    });

    if (existingTranscript) {
        console.log("[getYoutubeTranscript] Transcript found in the database! Returning cached transcript.");
        return {
            transcript: existingTranscript.transcript,
            cache: "This video has already been transcribed - Accessing cache transcript instead of using a token."
        };
    }

    try {
        console.log("[getYoutubeTranscript] Transcript not found in database. Fetching from YouTube...");
        const transcript = await fetchTranscript(videoId);

        console.log("[getYoutubeTranscript] Storing new transcript in the database...");
        await convex.mutation(api.transcript.storeTranscript, {
            videoId,
            userId: user.id,
            transcript
        });

        console.log("[getYoutubeTranscript] Tracking transcription event with Schematic...");
        await client.track({
            event: featureFlagEvents[FeatureFlag.TRANSCRIPTION].event,
            company: {
                id: user.id
            },
            user: {
                id: user.id
            }
        });

        console.log("[getYoutubeTranscript] Returning newly fetched and stored transcript.");
        return {
            transcript,
            cache: "This video was transcribed using a token, the transcript is now saved in the database."
        };
        
    } catch (error) {
        console.error("[getYoutubeTranscript] Error fetching transcript:", error);
        return {
            transcript: [],
            cache: "Error fetching transcript"
        };
    }
}