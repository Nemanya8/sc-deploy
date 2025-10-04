"use client"

import { Button } from "@/components/ui/button"
import { useAccount } from "@/lib/web3/hooks/use-account"
import { useWeb3Store } from "@/lib/web3/store/use-web3-store"
import { AccountDropdown } from "./account-dropdown"
import { Wallet } from "lucide-react"

export function Web3ConnectButton() {
  const { account } = useAccount()
  const { toggle } = useWeb3Store()

  if (account) {
    return <AccountDropdown account={account} />
  }

  return (
    <Button onClick={toggle} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
