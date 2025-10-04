import { PolkadotNamespaceChainId } from "@/types/web3"

export const POLKADOT_APP_NAME = "Smart Contract Deploy"

export const POLKADOT_CAIP_ID_MAP: Record<string, PolkadotNamespaceChainId> = {
  polkadot: "polkadot:91b171bb158e2d3848fa23a9f1c25182",
  kusama: "polkadot:b0a8d493285c2df73290dfb7e61f870f",
  westend: "polkadot:e143f23803ac50e8f6f8e62695d1ce9e",
}

export const POLKADOT_CHAIN_IDS = Object.values(POLKADOT_CAIP_ID_MAP)
