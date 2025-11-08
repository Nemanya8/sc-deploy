"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Coins, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccount } from "@/lib/web3/hooks/use-account"
import { usePapiClient } from "@/lib/papi/hooks/use-papi-client"

type AccountInfo = {
  free: bigint
  reserved: bigint
  frozen: bigint
}

type CodeInfo = {
  codeHash: string
  owner: string
  deposit: bigint
  refcount: bigint
  codeLen: number
  codeType: string
  behaviourVersion: number
}

export default function DashboardPage() {
  const { account } = useAccount()
  const { client, api, ready } = usePapiClient()
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [networkName, setNetworkName] = useState<string>("Loading...")
  const [contracts, setContracts] = useState<CodeInfo[]>([])
  const [, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!ready || !api || !client) return

      try {
        setError(null)

        const chain = await api.constants.System.Version()
        setNetworkName(chain.spec_name)

        if (account?.address) {
          const accInfo = await api.query.System.Account.getValue(account.address)
          setAccountInfo({
            free: accInfo.data.free,
            reserved: accInfo.data.reserved,
            frozen: accInfo.data.frozen
          })
        } else {
          setAccountInfo(null)
        }

        const entries = await api.query.Revive.CodeInfoOf.getEntries()
        const contractsList: CodeInfo[] = entries.map((entry) => ({
          codeHash: entry.keyArgs[0].asHex(),
          owner: entry.value.owner,
          deposit: entry.value.deposit,
          refcount: entry.value.refcount,
          codeLen: entry.value.code_len,
          codeType: entry.value.code_type.type,
          behaviourVersion: entry.value.behaviour_version,
        }))

        const myContracts = account?.address
          ? contractsList.filter(contract => contract.owner === account.address)
          : []

        setContracts(myContracts)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    fetchData()
  }, [ready, api, client, account])

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:border-primary text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>

      <div className="relative container mx-auto p-6 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[80vh]">
          <Card className="bg-background/50 backdrop-blur md:row-span-2 h-full flex flex-col">
            <CardHeader>
              <CardTitle>My Contracts</CardTitle>
              <CardDescription>View and manage your deployed contracts</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {!ready ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading contracts...</p>
                </div>
              ) : !account ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Connect your wallet to view your contracts</p>
                </div>
              ) : contracts.length > 0 ? (
                <div className="space-y-3">
                  {contracts.map((contract) => (
                    <div
                      key={contract.codeHash}
                      className="p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded">
                          {contract.codeType}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Refs: {Number(contract.refcount)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-foreground break-all">
                          {contract.codeHash.slice(0, 20)}...{contract.codeHash.slice(-10)}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{(Number(contract.deposit) / 1e10).toFixed(4)} PAS</span>
                          <span>{contract.codeLen.toLocaleString()} bytes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-muted-foreground text-center">You don&apos;t have any contracts deployed</p>
                  <Link
                    href="/deploy"
                    className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-accent transition-colors text-center"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Add new contract</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>Your wallet balance and assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!ready ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              ) : !account ? (
                <p className="text-muted-foreground text-center">Connect your wallet to view assets</p>
              ) : accountInfo ? (
                <>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Coins className="h-6 w-6 text-primary" />
                      <p className="text-sm text-muted-foreground">Free Balance</p>
                    </div>
                    <p className="text-3xl font-bold">
                      {(Number(accountInfo.free) / 1e10).toFixed(4)} PAS
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Reserved</p>
                      <p className="text-lg font-semibold">
                        {(Number(accountInfo.reserved) / 1e10).toFixed(4)} PAS
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Frozen</p>
                      <p className="text-lg font-semibold">
                        {(Number(accountInfo.frozen) / 1e10).toFixed(4)} PAS
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center">Loading account data...</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur md:col-start-2">
            <CardHeader>
              <CardTitle>Current Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {ready && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                  <p className="text-2xl font-semibold">{networkName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Block Time</p>
                    </div>
                    <p className="text-lg font-semibold">6s</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Network Fee</p>
                    </div>
                    <p className="text-lg font-semibold">~0.001 PAS</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

