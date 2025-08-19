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
        const transcriptResult = await getYoutubeTranscript(videoId);

        // If the result is a Response object, you might need to parse it first
        if (transcriptResult instanceof Response) {
            const data = await transcriptResult.json();
            return {
                transcript: data.transcript,
                cache: data.cache
            };
        }

        // Otherwise, assume it's already the structured object
        return {
            transcript: transcriptResult.transcript,
            cache: transcriptResult.cache
        };
    }
});