"use client"

import { useEffect, useState } from "react"
import { useAccount } from "@/lib/web3/hooks/use-account"
import { usePapiClient } from "@/lib/papi/hooks/use-papi-client"

type AccountInfo = {
  free: bigint
  reserved: bigint
  frozen: bigint
}

export function PapiDemo() {
  const { account } = useAccount()
  const { client, api, ready } = usePapiClient()
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [blockHash, setBlockHash] = useState<string | null>(null)
  const [systemInfo, setSystemInfo] = useState<{ name: string; version: number } | null>(null)
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined

    async function fetchData() {
      if (!ready || !api || !client) return

      try {
        setError(null)

        const chain = await api.constants.System.Version()
        setSystemInfo({
          name: chain.spec_name,
          version: chain.spec_version
        })

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

        subscription = client.finalizedBlock$.subscribe((finalizedBlock) => {
          setBlockNumber(finalizedBlock.number)
          setBlockHash(finalizedBlock.hash)
        })
      } catch (err) {
        console.error("Error fetching PAPI data:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    fetchData()

    return () => {
      subscription?.unsubscribe()
    }
  }, [ready, api, client, account])

  if (!ready) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to Paseo Asset Hub...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h3 className="font-semibold text-destructive mb-2">Connection Error</h3>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Polkadot API (PAPI) Demo
        </h2>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Connected to Paseo Asset Hub</span>
            </div>

            <div className="space-y-4">
              {systemInfo && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Chain Info
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {systemInfo.name} (v{systemInfo.version})
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Latest Finalized Block
                </label>
                <p className="text-2xl font-bold text-foreground">
                  #{blockNumber?.toLocaleString() ?? "..."}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Block Hash
                </label>
                <p className="font-mono text-sm text-foreground break-all bg-muted p-2 rounded">
                  {blockHash ?? "..."}
                </p>
              </div>
            </div>
          </div>

          {account && accountInfo && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Connected Account Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Address
                  </label>
                  <p className="font-mono text-sm text-foreground break-all bg-muted p-2 rounded">
                    {account.address}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-1">
                      Free Balance
                    </label>
                    <p className="text-xl font-bold text-foreground">
                      {(Number(accountInfo.free) / 1e10).toFixed(4)} PAS
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-1">
                      Reserved
                    </label>
                    <p className="text-xl font-bold text-foreground">
                      {(Number(accountInfo.reserved) / 1e10).toFixed(4)} PAS
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-1">
                      Frozen
                    </label>
                    <p className="text-xl font-bold text-foreground">
                      {(Number(accountInfo.frozen) / 1e10).toFixed(4)} PAS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!account && (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-muted-foreground">
                Connect your wallet to view account stats
              </p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>
              This demo connects to Paseo Asset Hub (wss://testnet-passet-hub.polkadot.io) using the typed
              PAPI descriptor and displays the latest finalized block information in real-time.
              {account && " Account stats are fetched using the System.Account query."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
