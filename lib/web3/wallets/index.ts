import { getWallets } from "@talismn/connect-wallets"
import { WalletProvider, WalletProviderType } from "@/types/web3"
import { ExternalWallet } from "./external-wallet"

const baseWallets = getWallets()
const externalWallet = new ExternalWallet()

export const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  ...baseWallets.map((wallet) => ({
    wallet,
    type: wallet.extensionName as WalletProviderType,
  })),
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
