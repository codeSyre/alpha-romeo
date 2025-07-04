"use client"

import React, { useEffect, useState } from 'react'
import SchematicEmbed from './SchematicEmbed'
import { EmbedProvider } from '@schematichq/schematic-components'
import { getTempAccessToken } from '@/actions/getTempAccessToken'
import { Loader2 } from 'lucide-react'

function SchematicComponent({ componentId }: { componentId: string }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (!componentId) {
          throw new Error("Component ID is required")
        }

        // Dynamically import the server action
        // const { getTempAccessToken } = await import('@/actions/getTempAccessToken')
        const token = await getTempAccessToken()

        if (!token) {
          throw new Error("Failed to get access token")
        }

        setAccessToken(token)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error("Error fetching access token:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [componentId])

  if (loading) {
    return <div className='w-full flex justify-center items-center mt-20'>
      <Loader2 className='animate-spin w-10 h-10' />
    </div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!accessToken) {
    return <div>Failed to load access token</div>
  }

  return (
    <EmbedProvider>
      <SchematicEmbed accessToken={accessToken!} componentId={componentId} />
    </EmbedProvider>
  )
}

export default SchematicComponent