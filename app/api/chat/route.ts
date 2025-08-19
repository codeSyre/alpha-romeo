import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { currentUser } from "@clerk/nextjs/server";
import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from "ai";
import { getVideoDetails } from "@/actions/getVideoDetails";
import z from "zod";
import { getYoutubeTranscript } from "@/actions/getYoutubeTranscript";
import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl";
import { titleGeneration } from "@/actions/titleGeneration";
// import { client } from "@/lib/schematic";
// import { FeatureFlag } from "@/features/flags";
// import { dalleImageGeneration } from "@/actions/dalleImageGeneration";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY
})

export async function POST(req: Request) {
    const user = await currentUser()
    if (!user) {
        return new Response("Unauthorized", { status: 401 })
    }

    const { messages, videoId }: { messages: UIMessage[], videoId: string } = await req.json()

    const videoDetails = await getVideoDetails(videoId)

    const systemMessage = `
    You are Alpha Romeo, a helpful assistant or AI Agent ready to accept questions from ${user.firstName}, the user, about ONE specific video. The video ID in question is ${videoId} but you will refer to it as ${videoDetails?.title}. Use emojis to make the conversation more engaging and fun. If an error occurs, explain it to the user in a manner that they will understand. Try and fix the error but if you fail 3 times, say "I'm sorry, I'm having trouble understanding you. Please try again later." If the error suggests the user to upgrade, explain to the user that they must upgrade to the required plan to be able to use the feature in question. Tell them to navigate the Manage Plan page to upgrade. If a tool is used, analyze the response and if contains any cache, explain that the transcript is cached because they previously transcribed the video saving the user a token. Use words like database instead of cache to make more easy to understand. Format for notion.
    `

    const result = streamText({
        model: google("gemini-2.5-pro"),
        // providerOptions: {
        //     google: { responseModalities: ['TEXT', 'IMAGE'] },
        // },
        stopWhen: stepCountIs(5),
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
            }),
            getVideoDetails: tool({
                name: "getVideoDetails",
                description: "Get the details of a YouTube video.",
                inputSchema: z.object({
                    videoId: z.string().describe("The video ID to get the details for")
                }),
                execute: async ({ videoId }) => {
                    const vidDetails = await getVideoDetails(videoId)
                    return { vidDetails }
                }
            }),
            extractVideoId: tool({
                name: "extractVideoId",
                description: "Extract the video ID from a URL",
                inputSchema: z.object({
                    url: z.string().describe("The URL to extract the video ID from")
                }),
                execute: async ({url})=>{
                    const vidId = await getVideoIdFromUrl(url)

                    return {vidId}
                }
            }),
            generateTitle: tool({
                name: "generateTitle",
                description: "Generate a title for a YouTube video",
                inputSchema: z.object({
                    videoId: z.string().describe("The video ID of the video to generate the title for"),
                    videoSummary: z.string().describe("The summary of the video to generate the title for"),
                    considerations: z.string().describe("Any additional considerations for the title"),
                }),
                execute: async ({videoId, videoSummary, considerations})=>{
                    const title = await titleGeneration(videoId, videoSummary, considerations)

                    return {title}
                }
            })
            // generateImage: generateImage(user.id, videoId)
            // generateImage: tool({
            //     description: "Generate an image",
            //     inputSchema: z.object({
            //         prompt: z.string().describe("The prompt to generate an image for"),
            //         videoId: z.string().describe("The YouTube video ID to generate an image for")
            //     }),
            //     execute: async ({ prompt }) => {
            //         const schematicCtx = {
            //             company: {
            //                 id: user.id,
            //             },
            //             user: {
            //                 id: user.id,
            //             }
            //         }
            //         const isImageGenerationEnabled = await client.checkFlag(
            //             schematicCtx,
            //             FeatureFlag.IMAGE_GENERATION,
            //         )

            //         if (!isImageGenerationEnabled) {
            //             throw new Error("Image generation is not enabled, the user must upgrade!")
            //         }

            //         const image = await dalleImageGeneration(prompt, videoId)

            //         return { image }
            //     }
            // })
        }
    })

    return result.toUIMessageStreamResponse()
} 