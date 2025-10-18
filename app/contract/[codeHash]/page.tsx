"use client"

import { useEffect, useState, use } from "react"
import { usePapiClient } from "@/lib/papi/hooks/use-papi-client"
import Link from "next/link"
import { ArrowLeft, FileCode, Activity, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type CodeInfo = {
  codeHash: string
  owner: string
  deposit: bigint
  refcount: bigint
  codeLen: number
  codeType: string
  behaviourVersion: number
}

type Transaction = {
  id: string
  extrinsicHash: string
  blockNumber: string
  timestamp: string
  type: string
  caller: string
  value: string
  success: boolean
}

type ContractInstance = {
  address: string
  deployer: string
  createdAt: string
}

export default function ContractDetailsPage({ params }: { params: Promise<{ codeHash: string }> }) {
  const resolvedParams = use(params)
  const codeHash = resolvedParams.codeHash

  const { api, ready, client } = usePapiClient()
  const [contract, setContract] = useState<CodeInfo | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [instances, setInstances] = useState<ContractInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContractData() {
      if (!ready || !api || !client) return

      try {
        setLoading(true)
        setError(null)

        // Fetch all contracts and find the one matching the hash
        const entries = await api.query.Revive.CodeInfoOf.getEntries()

        const contractEntry = entries.find((entry) =>
          entry.keyArgs[0].asHex() === codeHash
        )

        if (contractEntry) {
          setContract({
            codeHash: codeHash,
            owner: contractEntry.value.owner,
            deposit: contractEntry.value.deposit,
            refcount: contractEntry.value.refcount,
            codeLen: contractEntry.value.code_len,
            codeType: contractEntry.value.code_type.type,
            behaviourVersion: contractEntry.value.behaviour_version,
          })

        } else {
          setError("Contract not found")
        }

      } catch (err) {
        console.error("Error fetching contract data:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchContractData()
  }, [ready, api, client, codeHash])

  // Fetch transactions from SubQuery
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('http://localhost:3002/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetContractTransactions($codeHash: String!) {
                transactions(
                  filter: { contractId: { equalTo: $codeHash } }
                  orderBy: TIMESTAMP_DESC
                  first: 20
                ) {
                  nodes {
                    id
                    extrinsicHash
                    blockNumber
                    timestamp
                    type
                    caller
                    value
                    success
                  }
                }
                contractInstances(
                  filter: { codeHashId: { equalTo: $codeHash } }
                  first: 10
                ) {
                  nodes {
                    address
                    deployer
                    createdAt
                  }
                }
              }
            `,
            variables: {
              codeHash: codeHash,
            },
          }),
        })

        const data = await response.json()

        if (data.data) {
          setTransactions(data.data.transactions?.nodes || [])
          setInstances(data.data.contractInstances?.nodes || [])
        }
      } catch (err) {
        console.error("Error fetching transactions from SubQuery:", err)
        // Non-critical error - just log it
      }
    }

    if (codeHash) {
      fetchTransactions()
    }
  }, [codeHash])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contract details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-2xl mx-auto">
          <h3 className="font-semibold text-destructive mb-2">Error Loading Contract</h3>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-lg font-semibold mb-2">Contract Not Found</h3>
          <p className="text-muted-foreground mb-4">The contract with this hash does not exist.</p>
          <Link href="/my-contracts" className="text-primary hover:underline">
            Back to Contracts
          </Link>
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
        href="/my-contracts"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:border-primary text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>

      <div className="relative p-8 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <FileCode className="h-8 w-8 text-primary" />
              Contract Details
            </h1>
            <p className="text-muted-foreground">
              Detailed information about this smart contract
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {/* Contract Information */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Contract Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Code Hash
                  </label>
                  <p className="font-mono text-xs text-foreground break-all bg-muted px-2 py-1 rounded">
                    {contract.codeHash}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Owner
                  </label>
                  <p className="font-mono text-xs text-foreground break-all bg-muted px-2 py-1 rounded">
                    {contract.owner}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Type
                    </label>
                    <p className="text-sm font-semibold text-foreground">
                      {contract.codeType}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Ref Count
                    </label>
                    <p className="text-sm font-semibold text-foreground">
                      {Number(contract.refcount)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      Code Size
                    </label>
                    <p className="text-sm font-semibold text-foreground">
                      {contract.codeLen.toLocaleString()} bytes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Statistics */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Contract Statistics
                </CardTitle>
                <CardDescription>Usage metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {transactions.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total Transactions
                    </p>
                  </div>

                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {instances.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active Instances
                    </p>
                  </div>

                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {Number(contract.refcount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reference Count
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-foreground">
                      {(Number(contract.deposit) / 1e10).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">PAS Deposited</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-semibold text-foreground">
                      {(contract.codeLen / 1024).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">KB Code Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="bg-card border border-border mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Latest transactions indexed by SubQuery
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No transactions found.</p>
                  <p className="text-xs mt-1">
                    Make sure the SubQuery indexer is running at localhost:3002
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            tx.type === 'INSTANTIATE' ? 'bg-green-500/20 text-green-400' :
                            tx.type === 'CALL' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {tx.type}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            tx.success ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        </div>
                        <p className="font-mono text-xs text-muted-foreground truncate">
                          Hash: {tx.extrinsicHash}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          Caller: {tx.caller.slice(0, 10)}...{tx.caller.slice(-8)}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-foreground">
                          Block #{tx.blockNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contract Instances */}
          {instances.length > 0 && (
            <Card className="bg-card border border-border mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Contract Instances</CardTitle>
                <CardDescription>
                  Deployed instances of this contract code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {instances.map((instance) => (
                    <div
                      key={instance.address}
                      className="p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="grid md:grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">
                            Address
                          </label>
                          <p className="font-mono text-xs text-foreground">
                            {instance.address.slice(0, 10)}...{instance.address.slice(-8)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">
                            Deployer
                          </label>
                          <p className="font-mono text-xs text-foreground">
                            {instance.deployer.slice(0, 10)}...{instance.deployer.slice(-8)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">
                            Created
                          </label>
                          <p className="text-xs text-foreground">
                            {new Date(instance.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
              <CardDescription>
                More details about this contract
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Behaviour Version
                  </label>
                  <p className="text-sm font-semibold text-foreground">
                    {contract.behaviourVersion}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Contract Type
                  </label>
                  <p className="text-sm font-semibold text-foreground">
                    {contract.codeType}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Reference Count:</strong> Indicates how many instances of this contract code are deployed on the network.
                  Each instantiation increases the reference count.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
