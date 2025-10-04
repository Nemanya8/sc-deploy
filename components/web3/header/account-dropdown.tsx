"use client"

import { Account } from "@/types/web3"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { shortenAddress } from "@/lib/web3/utils/format"
import { useDisconnect } from "@/lib/web3/hooks/use-disconnect"
import { LogOut, Copy, Check } from "lucide-react"
import { useState } from "react"
import { AccountAvatar } from "@/components/web3/ui/account-avatar"

interface AccountDropdownProps {
  account: Account
}

export function AccountDropdown({ account }: AccountDropdownProps) {
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(account.displayAddress || account.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 flex items-center">
          <AccountAvatar
            address={account.address}
            size={24}
            className="flex-shrink-0"
          />
          <span className="font-mono text-sm">
            {shortenAddress(account.displayAddress || account.address)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{account.name}</span>
            <span className="text-xs font-mono text-muted-foreground">
              {shortenAddress(account.displayAddress || account.address, 8, 6)}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
