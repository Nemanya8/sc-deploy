"use client"

import { useAccount } from "@/lib/web3/hooks/use-account"
import { useWeb3Store } from "@/lib/web3/store/use-web3-store"
import { AccountDropdown } from "./account-dropdown"
import { Wallet } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function Web3ConnectButton() {
  const { account } = useAccount()
  const { toggle } = useWeb3Store()

  if (account) {
    return <AccountDropdown account={account} />
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={toggle} size="lg" className="w-full">
          <Wallet className="h-5 w-5" />
          <span className="font-medium">Connect Wallet</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
