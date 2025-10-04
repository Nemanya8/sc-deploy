import { getWallets } from "@talismn/connect-wallets"
import { WalletProvider, WalletProviderType } from "@/types/web3"
import { ExternalWallet } from "./external-wallet"

const baseWallets = getWallets()
const externalWallet = new ExternalWallet()

// Filter out duplicate wallets and normalize wallet types
const uniqueWallets = baseWallets.reduce<WalletProvider[]>((acc, wallet) => {
  const type = wallet.extensionName as WalletProviderType

  // Skip if we already have this wallet type
  if (acc.some((w) => w.type === type)) {
    return acc
  }

  acc.push({
    wallet,
    type,
  })
  return acc
}, [])

export const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  ...uniqueWallets,
  {
    wallet: externalWallet,
    type: WalletProviderType.ExternalWallet,
  },
]

export function getSupportedWallets() {
  return SUPPORTED_WALLET_PROVIDERS
}

export function getWalletByType(
  type?: WalletProviderType | null
): WalletProvider | null {
  if (!type) return null
  return (
    SUPPORTED_WALLET_PROVIDERS.find((provider) => provider.type === type) || null
  )
}
