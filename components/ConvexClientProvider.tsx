"use client"

import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"

export const convex = new ConvexReactClient(
    process.env.NEXT_PUBLIC_CONVEX_URL!
)

export default function ConvexClientProvider(
    { children }: Readonly<{
        children: React.ReactNode
    }>
) {

    return <ClerkProvider afterSignOutUrl={"/"}>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
            {children}
        </ConvexProviderWithClerk>
    </ClerkProvider>
}