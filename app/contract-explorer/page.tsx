"use client"

import { useEffect, useState, useMemo } from "react"
import { usePapiClient } from "@/lib/papi/hooks/use-papi-client"
import { useAccount } from "@/lib/web3/hooks/use-account"
import Link from "next/link"
import { FileCode, Filter, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest")
  const [currentPage, setCurrentPage] = useState(1)
  
  const CONTRACTS_PER_PAGE = 30

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
    const filtered = contracts.filter((contract) => {
      const ownerMatch = ownerFilter === "all" ||
        (ownerFilter === "mine" && account?.address === contract.owner)

      const codeTypeMatch = codeTypeFilter === "all" || contract.codeType === codeTypeFilter

      return ownerMatch && codeTypeMatch
    })

    // Apply sorting
    const sorted = [...filtered]
    if (sortBy === "newest") {
      sorted.reverse() // Reverse original order (assuming API returns oldest first)
    } else if (sortBy === "oldest") {
      // Keep original order
    } else if (sortBy === "popular") {
      sorted.sort((a, b) => Number(b.refcount) - Number(a.refcount))
    }

    return sorted
  }, [contracts, ownerFilter, codeTypeFilter, account, sortBy])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [ownerFilter, codeTypeFilter, sortBy])

  // Pagination calculations
  const totalPages = Math.ceil(filteredContracts.length / CONTRACTS_PER_PAGE)
  const startIndex = (currentPage - 1) * CONTRACTS_PER_PAGE
  const endIndex = startIndex + CONTRACTS_PER_PAGE
  const paginatedContracts = filteredContracts.slice(startIndex, endIndex)

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
    <div className="min-h-screen relative">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:border-primary text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>
      
      <div className="relative p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Contracts</h1>
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
          <div className="grid gap-4 w-full">
            <div className="bg-card border border-border rounded-lg p-4 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <div className="text-sm text-muted-foreground">
                  Total Contracts: {contracts.length} | Showing: {filteredContracts.length}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />

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

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "popular")}
                    className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
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
              <>
              <div className="grid gap-3 w-full">
                {paginatedContracts.map((contract, index) => (
                <Link
                  href={`/contract/${contract.codeHash}`}
                  key={contract.codeHash}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors w-full overflow-hidden cursor-pointer block"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <FileCode className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2 min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground">
                          Contract #{startIndex + index + 1}
                        </span>
                        <span className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded flex-shrink-0">
                          {contract.codeType}
                        </span>
                      </div>

                      <div className="w-full overflow-hidden">
                        <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                          Hash
                        </label>
                        <p className="font-mono text-xs text-foreground break-all bg-muted px-2 py-1 rounded overflow-wrap-anywhere">
                          {contract.codeHash}
                        </p>
                      </div>

                      <div className="w-full overflow-hidden">
                        <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                          Owner
                        </label>
                        <p className="font-mono text-xs text-foreground break-all bg-muted px-2 py-1 rounded overflow-wrap-anywhere">
                          {contract.owner}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <div className="min-w-0">
                          <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                            Deposit
                          </label>
                          <p className="text-xs font-semibold text-foreground truncate">
                            {(Number(contract.deposit) / 1e10).toFixed(4)} PAS
                          </p>
                        </div>

                        <div className="min-w-0">
                          <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                            Ref Count
                          </label>
                          <p className="text-xs font-semibold text-foreground">
                            {Number(contract.refcount)}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                            Size
                          </label>
                          <p className="text-xs font-semibold text-foreground truncate">
                            {contract.codeLen.toLocaleString()} bytes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 w-full">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredContracts.length)} of {filteredContracts.length}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-border rounded-lg text-foreground hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center gap-1 flex-wrap justify-center max-w-full overflow-x-auto">
                      {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                        // Show first 10 pages or pages around current page
                        let page;
                        if (totalPages <= 10) {
                          page = i + 1;
                        } else if (currentPage <= 5) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 4) {
                          page = totalPages - 9 + i;
                        } else {
                          page = currentPage - 4 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                              currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-border rounded-lg text-foreground hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
