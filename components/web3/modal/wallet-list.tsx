"use client"

import { WalletProviderType } from "@/types/web3"
import { WALLET_INFO } from "@/lib/web3/constants/wallets"
import { getSupportedWallets } from "@/lib/web3/wallets"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface WalletListProps {
  onSelectWallet: (type: WalletProviderType) => void
}

export function WalletList({ onSelectWallet }: WalletListProps) {
  const wallets = getSupportedWallets()

  return (
    <div className="grid gap-2">
      {wallets.map(({ wallet, type }) => {
        const info = WALLET_INFO[type]
        const isInstalled = wallet.installed

        return (
          <Button
            key={type}
            variant="outline"
            className="w-full justify-between h-auto py-4"
            onClick={() => onSelectWallet(type)}
            disabled={!isInstalled && type !== WalletProviderType.ExternalWallet}
          >
            <div className="flex items-center gap-3">
              {wallet.logo?.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={wallet.logo.src}
                  alt={wallet.logo.alt}
                  className="h-8 w-8"
                />
              )}
              <div className="text-left">
                <div className="font-semibold">{info?.name || wallet.title}</div>
                <div className="text-xs text-muted-foreground">
                  {info?.description}
                </div>
              </div>
            </div>
            {!isInstalled && type !== WalletProviderType.ExternalWallet && (
              <a
                href={info?.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-blue-500 flex items-center gap-1"
              >
                Install
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </Button>
        )
      })}
    </div>
  )
}
