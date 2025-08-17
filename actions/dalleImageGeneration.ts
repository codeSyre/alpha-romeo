"use server"

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

const IMAGE_SIZE = "1024x1024" as const;

const convexClient = getConvexClient();

export const dalleImageGeneration = async (prompt: string, videoId: string) => {
    const user = await currentUser()

    if (!user?.id) {
        throw new Error("User not found")
    }

    if(!process.env.OPENAI_API_KEY){
        throw new Error("Could not find OPENAI_API_KEY")
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    if(!prompt) {
        throw new Error("Failed to generate image prompt")
    }

    console.log("Generating image prompt with prompt: ", prompt)

    const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: IMAGE_SIZE,
        quality: "standard",
        style: "vivid",
    })

    console.log("Image Response: ", imageResponse)

    const imageUrl = imageResponse.data?.[0]?.url

    if (!imageUrl) {
        throw new Error("Failed to generate image")
    }

    // Step 1: create a short lived upload url for convex
    console.log("generating short lived upload url for convex")
    const postUrl = await convexClient.mutation(api.images.createUploadUrl)
    console.log("Got the upload url: ", postUrl)

    // STep 2: Download the image from the server
    console.log("Downloading the image from OpenAI...")
    const image: Blob = await fetch(imageUrl).then((res)=> res.blob())
    console.log("Downloaded image successfully.")

    // Step 3: Upload the image to the convex storage bucket
    console.log("Uploading the image to storage ")
    const result = await fetch(postUrl, {
        method: "POST",
        headers: {"Content-Type": image!.type},
        body: image
    })

    const {storageId} = await result.json()

    console.log("Uploaded the image to storage with the ID: ", storageId)

    // Step 4: Save newly allocated storage id to the database
    console.log("Saving the newly allocated storage id to the database")
    await convexClient.mutation(api.images.storeImage, {
        storageId: storageId,
        userId: user.id,
        videoId
    })

    // Get serve image url
    const dbImageUrl = await convexClient.query(api.images.getImage, {
        videoId,
        userId: user.id
    })

    // Track the image generation event
    await client.track({
        event: featureFlagEvents[FeatureFlag.IMAGE_GENERATION].event,
        company: {
            id: user.id
        },
        user: {
            id: user.id
        }
    })

    return {
        imageUrl: dbImageUrl
    }
}

