import { createClient, PolkadotClient, TypedApi } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { passet } from "@polkadot-api/descriptors"

let clientInstance: PolkadotClient | null = null
let apiInstance: TypedApi<typeof passet> | null = null

export function getPapiClient(): PolkadotClient {
  if (!clientInstance) {
    clientInstance = createClient(
      withPolkadotSdkCompat(
        getWsProvider("wss://testnet-passet-hub.polkadot.io")
      )
    )
  }
  return clientInstance
}

export function getPapiApi(): TypedApi<typeof passet> {
  if (!apiInstance) {
    const client = getPapiClient()
    apiInstance = client.getTypedApi(passet)
  }
  return apiInstance
}

export function destroyPapiClient() {
  if (clientInstance) {
    clientInstance.destroy()
    clientInstance = null
    apiInstance = null
  }
}
