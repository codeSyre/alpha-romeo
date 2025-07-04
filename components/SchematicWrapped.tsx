"use client"

import { useUser } from "@clerk/nextjs"
import { useSchematicEvents } from "@schematichq/schematic-react"
import { useEffect } from "react"

export default function SchematicWrapped(
    { children }: Readonly<{
        children: React.ReactNode
    }>
) {
    const {user} = useUser()
    const {identify} = useSchematicEvents()

    useEffect(()=>{
        const userName = user?.username ?? user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? user?.id

        if(user?.id){
            identify({
                // Company Level 
                company: {
                    keys: {
                        id: user.id
                    },
                    name: userName
                },

                // User Level 
                keys: {
                    id: user.id
                },
                name: userName
            })
        }
    }, [user, identify])

    return children
}