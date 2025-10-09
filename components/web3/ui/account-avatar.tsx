"use client"

import { cn } from "@/lib/utils"
import { WalletProviderType } from "@/lib/web3/types/web3"
import { PolkadotAvatar } from "./polkadot-avatar"
import { TalismanAvatar } from "./talisman-avatar"

interface AccountAvatarProps {
  address: string
  size?: number
  className?: string
  provider?: WalletProviderType
}

export function AccountAvatar({
  address,
  size = 40,
  className,
  provider,
}: AccountAvatarProps) {
  // Determine which avatar to use based on provider
  const isTalisman = provider === WalletProviderType.Talisman

  // Use Talisman avatar for Talisman wallet, otherwise use Polkadot avatar
  if (isTalisman) {
    return (
      <div
        className={cn(
          "rounded-full overflow-hidden flex-shrink-0",
          className
        )}
      >
        <TalismanAvatar seed={address} size={size} />
      </div>
    )
  }

  // Default to Polkadot avatar for all other wallets
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden flex-shrink-0",
        className
      )}
    >
      <PolkadotAvatar address={address} size={size} />
    </div>
  )
}
