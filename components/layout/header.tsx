"use client"

import { Web3ConnectButton } from "@/components/web3/header/web3-connect-button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold">SC Deploy</div>
            {/* Add navigation items here */}
          </div>

          <div className="flex items-center gap-4">
            <Web3ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
