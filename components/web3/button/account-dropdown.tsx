"use client"

import { Account } from "@/lib/web3/types/web3"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { shortenAddress } from "@/lib/web3/utils/format"
import { useDisconnect } from "@/lib/web3/hooks/use-disconnect"
import { LogOut, Copy, Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { AccountAvatar } from "@/components/web3/ui/account-avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface AccountDropdownProps {
  account: Account
}

export function AccountDropdown({ account }: AccountDropdownProps) {
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)
  const { isMobile } = useSidebar()

  const handleCopy = () => {
    navigator.clipboard.writeText(account.displayAddress || account.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <AccountAvatar
                address={account.address}
                size={32}
                className="rounded-lg"
                provider={account.provider}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{account.name}</span>
                <span className="truncate text-xs font-mono">
                  {shortenAddress(account.displayAddress || account.address)}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <AccountAvatar
                  address={account.address}
                  size={32}
                  className="rounded-lg"
                  provider={account.provider}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{account.name}</span>
                  <span className="truncate text-xs font-mono">
                    {shortenAddress(account.displayAddress || account.address)}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopy}>
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied!" : "Copy Address"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => disconnect()} className="text-red-600">
              <LogOut />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
