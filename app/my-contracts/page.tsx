"use client"

import { useEffect, useState, useMemo } from "react"
import { usePapiClient } from "@/lib/papi/hooks/use-papi-client"
import { useAccount } from "@/lib/web3/hooks/use-account"
import { FileCode, Filter } from "lucide-react"

type CodeInfo = {
  codeHash: string
  owner: string
  deposit: bigint
  refcount: bigint
  codeLen: number
  codeType: string
  behaviourVersion: number
}

export default function MyContractsPage() {
  const { api, ready } = usePapiClient()
  const { account } = useAccount()
  const [contracts, setContracts] = useState<CodeInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<"all" | "mine">("all")
  const [codeTypeFilter, setCodeTypeFilter] = useState<string>("all")

  useEffect(() => {
    async function fetchContracts() {
      if (!ready || !api) return

      try {
        setLoading(true)
        setError(null)

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

        setContracts(contractsList)
      } catch (err) {
        console.error("Error fetching contracts:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [ready, api])

  const codeTypes = useMemo(() => {
    const types = new Set(contracts.map(c => c.codeType))
    return Array.from(types)
  }, [contracts])

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const ownerMatch = ownerFilter === "all" ||
        (ownerFilter === "mine" && account?.address === contract.owner)

      const codeTypeMatch = codeTypeFilter === "all" || contract.codeType === codeTypeFilter

      return ownerMatch && codeTypeMatch
    })
  }, [contracts, ownerFilter, codeTypeFilter, account])

  if (!ready || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h3 className="font-semibold text-destructive mb-2">Error Loading Contracts</h3>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Contracts</h1>
          <p className="text-muted-foreground">
            All smart contracts deployed on Paseo Asset Hub
          </p>
        </div>

        {contracts.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <FileCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Contracts Found</h3>
            <p className="text-muted-foreground">
              No smart contracts have been deployed yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-muted-foreground">
                  Total Contracts: {contracts.length} | Showing: {filteredContracts.length}
                </div>

                <div className="flex items-center gap-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />

                  <select
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value as "all" | "mine")}
                    className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Contracts</option>
                    <option value="mine" disabled={!account}>
                      My Contracts {!account && "(Connect Wallet)"}
                    </option>
                  </select>

                  <select
                    value={codeTypeFilter}
                    onChange={(e) => setCodeTypeFilter(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Types</option>
                    {codeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredContracts.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <FileCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Contracts Match Filter</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more contracts.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredContracts.map((contract, index) => (
                <div
                  key={contract.codeHash}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileCode className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Contract #{index + 1}
                        </label>
                        <h3 className="text-lg font-semibold text-foreground">
                          Code Hash
                        </h3>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Hash
                        </label>
                        <p className="font-mono text-sm text-foreground break-all bg-muted p-2 rounded">
                          {contract.codeHash}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Owner
                        </label>
                        <p className="font-mono text-sm text-foreground break-all bg-muted p-2 rounded">
                          {contract.owner}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">
                            Deposit
                          </label>
                          <p className="text-sm font-semibold text-foreground">
                            {(Number(contract.deposit) / 1e10).toFixed(4)} PAS
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">
                            Reference Count
                          </label>
                          <p className="text-sm font-semibold text-foreground">
                            {Number(contract.refcount)}
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">
                            Code Length
                          </label>
                          <p className="text-sm font-semibold text-foreground">
                            {contract.codeLen.toLocaleString()} bytes
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">
                            Code Type
                          </label>
                          <p className="text-sm font-semibold text-foreground">
                            {contract.codeType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
