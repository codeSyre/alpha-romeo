import { getYoutubeTranscript } from "@/actions/getYoutubeTranscript";
import { tool } from "ai";
import { z } from "zod";

const schema = z.object({
    videoId: z.string().describe("The YouTube video ID to fetch transcript for")
});

export default tool({
    name: 'fetchTranscript',
    description: "Fetch the transcript of a youtube video in segments",
    inputSchema: schema,
    execute: async ({ videoId }) => {
        const transcript = await getYoutubeTranscript(videoId);
        return {
            transcript: transcript.transcript,
            cache: transcript.cache
        };
    }
});