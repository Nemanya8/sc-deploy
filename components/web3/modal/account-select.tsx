"use client"

import { Account } from "@/types/web3"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { shortenAddress } from "@/lib/web3/utils/format"
import { Loader2 } from "lucide-react"

interface AccountSelectProps {
  accounts: Account[]
  isLoading: boolean
  onSelectAccount: (account: Account) => void
}

export function AccountSelect({
  accounts,
  isLoading,
  onSelectAccount,
}: AccountSelectProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No accounts found
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {accounts.map((account) => (
        <Button
          key={account.address}
          variant="outline"
          className="w-full justify-start h-auto py-4"
          onClick={() => onSelectAccount(account)}
        >
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {account.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="text-left flex-1">
              <div className="font-semibold">{account.name || "Unnamed"}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {shortenAddress(account.displayAddress || account.address)}
              </div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}
