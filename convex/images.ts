import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getImages = query({
    args: {
        userId: v.string(),
        videoId: v.string()
    },
    handler: async (ctx, args) => {
        const images = await ctx.db
            .query("images")
            .withIndex("by_user_and_video")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .filter((q) => q.eq(q.field("videoId"), args.videoId))
            .collect()

        const imagesUrls = Promise.all(
            images.map(async (image) => ({
                ...image,
                url: await ctx.storage.getUrl(image.storageId)
            }))
        )
        return imagesUrls
    },
})

export const createUploadUrl = mutation(async (ctx) => {
    const url = await ctx.storage.generateUploadUrl()
    return url
})

// Store a new image URL for a video
export const storeImage = mutation({
    args: {
        storageId: v.id("_storage"),
        userId: v.string(),
        videoId: v.string(),
    },
    handler: async (ctx, args) => {
        const imageId = await ctx.db.insert("images", {
            storageId: args.storageId,
            videoId: args.videoId,
            userId: args.userId
        })

        return imageId
    }
})

// Get images for a specific user and video combination
export const getImage = query({
    args: {
        userId: v.string(),
        videoId: v.string()
    },
    handler: async (ctx, args) => {
        const image = await ctx.db
        .query("images")
        .withIndex("by_user_and_video", (q) =>
            q.eq("userId", args.userId).eq("videoId", args.videoId))
        .first()

        if(!image){
            return null
        }

        return await ctx.storage.getUrl(image.storageId)
    }
})