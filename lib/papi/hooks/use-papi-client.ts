"use client"

import { useEffect, useState } from "react"
import { getPapiClient, getPapiApi } from "../client"
import type { PolkadotClient, TypedApi } from "polkadot-api"
import type { passet } from "@polkadot-api/descriptors"

export function usePapiClient() {
  const [client, setClient] = useState<PolkadotClient | null>(null)
  const [api, setApi] = useState<TypedApi<typeof passet> | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const papiClient = getPapiClient()
    const papiApi = getPapiApi()

    setClient(papiClient)
    setApi(papiApi)
    setReady(true)
  }, [])

  return { client, api, ready }
}
