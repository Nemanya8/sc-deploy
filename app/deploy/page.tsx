"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import Link from "next/link"
import { Rocket, FileCode, ArrowLeft } from "lucide-react"
import contractPresets from "@/lib/contract-presets.json"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useAccount } from "@/lib/web3/hooks/use-account"
import { usePapiClient } from "@/lib/papi/hooks/use-papi-client"
import { getWalletByType } from "@/lib/web3/wallets"
import { getPolkadotSignerFromPjs } from "polkadot-api/pjs-signer"
import { toast } from "sonner"
import {
  erc20,
  erc721,
  erc1155,
  governor,
  custom,
  type ERC20Options,
  type ERC721Options,
  type ERC1155Options,
  type GovernorOptions,
  type CustomOptions,
  infoDefaults
} from "@openzeppelin/wizard"

type ContractPreset = "ERC20" | "ERC721" | "ERC1155" | "Governor" | "Custom"

const PRESET_CONTRACTS = contractPresets as Record<Exclude<ContractPreset, "Governor">, string>

export default function DeployPage() {
  const { account } = useAccount()
  const { api, ready } = usePapiClient()
  const [selectedPreset, setSelectedPreset] = useState<ContractPreset>("ERC20")
  const [code, setCode] = useState(PRESET_CONTRACTS.ERC20)
  const [isCompiling, setIsCompiling] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [compilationOutput, setCompilationOutput] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gasEstimate, setGasEstimate] = useState<any>(null)
  const [estimating, setEstimating] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)

  const [erc20Settings, setErc20Settings] = useState<Required<ERC20Options>>({
    ...erc20.defaults,
    name: "MyToken",
    symbol: "MTK",
    premint: "",
    upgradeable: false, // Disable upgradeability for Polkadot
    info: { ...infoDefaults },
  })

  const [erc721Settings, setErc721Settings] = useState<Required<ERC721Options>>({
    ...erc721.defaults,
    name: "MyToken",
    symbol: "MTK",
    baseUri: "https://...",
    upgradeable: false, // Disable upgradeability for Polkadot
    info: { ...infoDefaults },
  })

  const [erc1155Settings, setErc1155Settings] = useState<Required<ERC1155Options>>({
    ...erc1155.defaults,
    name: "MyToken",
    uri: "https://...",
    upgradeable: false, // Disable upgradeability for Polkadot
    info: { ...infoDefaults },
  })

  const [governorSettings, setGovernorSettings] = useState<Required<GovernorOptions>>({
    ...governor.defaults,
    name: "MyGovernor",
    delay: "1 day",
    period: "1 week",
    votes: "erc20votes",
    upgradeable: false, // Disable upgradeability for Polkadot
    info: { ...infoDefaults },
  })

  const [customSettings, setCustomSettings] = useState<Required<CustomOptions>>({
    ...custom.defaults,
    name: "MyContract",
    pausable: false,
    upgradeable: false, // Disable upgradeability for Polkadot
    info: { ...infoDefaults },
  })

  const handlePresetChange = (preset: ContractPreset) => {
    setSelectedPreset(preset)
    if (preset === "Custom" || preset === "Governor") {
      setShowSettings(true)
      if (preset === "Custom") {
        generateCustomContract()
      } else {
        generateGovernorContract()
      }
    } else {
      setShowSettings(true)
      if (preset === "ERC20") {
        generateERC20Contract()
      } else if (preset === "ERC721") {
        generateERC721Contract()
      } else if (preset === "ERC1155") {
        generateERC1155Contract()
      }
    }
  }

  const generateERC20Contract = () => {
    try {
      const contract = erc20.print(erc20Settings)
      setCode(contract)
    } catch (error) {
      console.error("Error generating ERC20 contract:", error)
      toast.error("Failed to generate contract")
    }
  }

  const generateERC721Contract = () => {
    try {
      const contract = erc721.print(erc721Settings)
      setCode(contract)
    } catch (error) {
      console.error("Error generating ERC721 contract:", error)
      toast.error("Failed to generate contract")
    }
  }

  const generateERC1155Contract = () => {
    try {
      const contract = erc1155.print(erc1155Settings)
      setCode(contract)
    } catch (error) {
      console.error("Error generating ERC1155 contract:", error)
      toast.error("Failed to generate contract")
    }
  }

  const generateGovernorContract = () => {
    try {
      const contract = governor.print(governorSettings)
      setCode(contract)
    } catch (error) {
      console.error("Error generating Governor contract:", error)
      toast.error("Failed to generate contract")
    }
  }

  const generateCustomContract = () => {
    try {
      const contract = custom.print(customSettings)
      setCode(contract)
    } catch (error) {
      console.error("Error generating Custom contract:", error)
      toast.error("Failed to generate contract")
    }
  }

  useEffect(() => {
    if (selectedPreset === "ERC20") {
      generateERC20Contract()
    } else if (selectedPreset === "ERC721") {
      generateERC721Contract()
    } else if (selectedPreset === "ERC1155") {
      generateERC1155Contract()
    } else if (selectedPreset === "Governor") {
      generateGovernorContract()
    } else if (selectedPreset === "Custom") {
      generateCustomContract()
    }
  }, [erc20Settings, erc721Settings, erc1155Settings, governorSettings, customSettings, selectedPreset])

  const updateERC20Setting = <K extends keyof Required<ERC20Options>>(key: K, value: Required<ERC20Options>[K]) => {
    setErc20Settings(prev => ({ ...prev, [key]: value }))
  }

  const updateERC721Setting = <K extends keyof Required<ERC721Options>>(key: K, value: Required<ERC721Options>[K]) => {
    setErc721Settings(prev => ({ ...prev, [key]: value }))
  }

  const updateERC1155Setting = <K extends keyof Required<ERC1155Options>>(key: K, value: Required<ERC1155Options>[K]) => {
    setErc1155Settings(prev => ({ ...prev, [key]: value }))
  }

  const updateGovernorSetting = <K extends keyof Required<GovernorOptions>>(key: K, value: Required<GovernorOptions>[K]) => {
    setGovernorSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateCustomSetting = <K extends keyof Required<CustomOptions>>(key: K, value: Required<CustomOptions>[K]) => {
    setCustomSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleCompile = async () => {
    setIsCompiling(true)
    setCompilationOutput(null)
    setGasEstimate(null)
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const result = await response.json()

      if (response.ok) {
        setCompilationOutput(result)
        toast.success("Compilation successful!")

        // Auto-estimate gas after successful compilation
        if (result.contracts) {
          // Look specifically for contract.sol (our main contract)
          const fileName = "contract.sol"
          if (!result.contracts[fileName]) {
            toast.error("Main contract not found in compilation output")
            return
          }

          const contractName = Object.keys(result.contracts[fileName])[0]
          const contract = result.contracts[fileName][contractName]

          // Try different possible bytecode locations
          let bytecode = contract.evm?.bytecode?.object ||
                        contract.evm?.bytecode ||
                        contract.bytecode?.object ||
                        contract.bytecode ||
                        contract.bin ||
                        contract.binary

          // If bytecode is an object, try to extract the actual hex string
          if (bytecode && typeof bytecode === 'object') {
            bytecode = bytecode.object || bytecode.bytecode || bytecode.hex
          }

          if (bytecode && typeof bytecode === 'string') {
            handleEstimateGas(bytecode)
          } else {
            toast.warning("Compilation succeeded but no bytecode found")
          }
        } else {
          toast.warning("Compilation succeeded but no contracts found")
        }
      } else {
        const errorMessage = result.error || result.message || 'Unknown compilation error'
        setCompilationOutput({ error: errorMessage })
        toast.error("Compilation failed", {
          description: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
          duration: 10000,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setCompilationOutput({ error: errorMessage })
      toast.error("Compilation failed", {
        description: errorMessage,
        duration: 10000,
      })
    } finally {
      setIsCompiling(false)
    }
  }

  const handleEstimateGas = async (bytecode: string) => {
    setEstimating(true)
    setGasEstimate(null)
    try {
      const response = await fetch('/api/estimate-gas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bytecode, data: "0x", value: "0" }),
      })
      const result = await response.json()

      if (result.error) {
        toast.error("Gas estimation failed", {
          description: result.error,
          duration: 5000,
        })
      } else {
        toast.success("Gas estimated successfully")
      }

      setGasEstimate(result)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      toast.error("Gas estimation failed", {
        description: errorMsg,
        duration: 5000,
      })
      setGasEstimate({ error: errorMsg })
    } finally {
      setEstimating(false)
    }
  }

  const handleDeploy = async () => {
    if (!account) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!compilationOutput) {
      toast.error("Please compile the contract first")
      return
    }

    if (!gasEstimate) {
      toast.warning("Deploying without gas estimation - using default values")
    }

    if (!ready || !api) {
      toast.error("API not ready")
      return
    }

    setIsDeploying(true)
    toast.loading("Preparing deployment...")

    try {
      // Check account balance first
      const accountInfo = await api.query.System.Account.getValue(account.address)
      const balance = accountInfo.data.free

      if (balance === BigInt(0)) {
        throw new Error("Account has no balance. Please fund your account with PAS tokens from the faucet.")
      }

      // Get bytecode from compilation output
      const fileName = "contract.sol"
      if (!compilationOutput.contracts[fileName]) {
        throw new Error("contract.sol not found in compilation output")
      }

      const contractName = Object.keys(compilationOutput.contracts[fileName])[0]
      const contract = compilationOutput.contracts[fileName][contractName]

      // Try different possible bytecode locations (for different compiler outputs)
      let bytecode = contract.evm?.bytecode?.object ||
                    contract.evm?.bytecode ||
                    contract.bytecode?.object ||
                    contract.bytecode ||
                    contract.bin ||
                    contract.binary

      // If bytecode is an object, try to extract the actual hex string
      if (bytecode && typeof bytecode === 'object') {
        bytecode = bytecode.object || bytecode.bytecode || bytecode.hex
      }

      if (!bytecode || typeof bytecode !== 'string') {
        throw new Error(`No bytecode found in compilation output. Available properties: ${Object.keys(contract).join(', ')}`)
      }

      // Get the wallet provider
      const walletProvider = getWalletByType(account.provider)
      if (!walletProvider) {
        throw new Error("Wallet provider not found")
      }

      // Get accounts from wallet
      await walletProvider.wallet.enable("SmartContract Deployer")
      const accounts = await walletProvider.wallet.getAccounts()
      const walletAccount = accounts.find(acc => acc.address === account.address)

      if (!walletAccount) {
        throw new Error("Account not found in wallet")
      }

      // Parse gas limits from estimate
      const refTime = gasEstimate.gasRequired?.refTime?.replace(/,/g, '') || "500000000000"
      const proofSize = gasEstimate.gasRequired?.proofSize?.replace(/,/g, '') || "1000000"
      const storageDepositStr = gasEstimate.storageDeposit?.estimate?.replace(/,/g, '')

      // Convert hex string to Binary format for polkadot-api
      const hexToBytes = (hex: string) => {
        const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
        const bytes: number[] = []
        for (let i = 0; i < cleanHex.length; i += 2) {
          bytes.push(parseInt(cleanHex.substring(i, i + 2), 16))
        }
        return bytes
      }

      const codeBytes = hexToBytes(bytecode)
      const dataBytes: number[] = [] // Empty constructor data

      // Build the transaction with Binary objects
      const txParams = {
        value: BigInt(0),
        gas_limit: {
          ref_time: BigInt(refTime),
          proof_size: BigInt(proofSize),
        },
        storage_deposit_limit: storageDepositStr ? BigInt(storageDepositStr) : undefined,
        code: { asBytes: () => codeBytes },
        data: { asBytes: () => dataBytes },
        salt: undefined,
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tx = api.tx.Revive.instantiate_with_code(txParams as any)

      // Create polkadot-api compatible signer using the helper function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const walletSigner = walletAccount.signer as any

      if (!walletSigner || !walletSigner.signPayload || !walletSigner.signRaw) {
        throw new Error("Signer not available from wallet")
      }

      // Use the polkadot-api helper to convert PJS signer
      // Bind methods to preserve 'this' context for different wallet implementations
      const polkadotSigner = getPolkadotSignerFromPjs(
        account.address,
        walletSigner.signPayload.bind(walletSigner),
        walletSigner.signRaw.bind(walletSigner)
      )

      // Sign and submit the transaction
      const txHashResult = await tx.signAndSubmit(polkadotSigner)

      // Extract the actual hash - it might be in different formats
      let txHash: string
      if (typeof txHashResult === 'string') {
        txHash = txHashResult
      } else if (txHashResult && typeof txHashResult === 'object') {
        // Try different possible properties
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = txHashResult as any
        txHash = result.txHash || result.hash || result.toString()
      } else {
        txHash = String(txHashResult)
      }

      toast.dismiss()

      toast.success("Contract deployment successful!", {
        description: `Transaction Hash: ${txHash}`,
        duration: 10000,
        action: {
          label: "View Contract",
          onClick: () => window.location.href = `/contract/${txHash}`,
        },
      })

      // Wait for finalization (optional)
      setTimeout(() => {
        setIsDeploying(false)
      }, 2000)

    } catch (error) {
      console.error("Deployment error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast.dismiss()
      toast.error("Deployment failed", {
        description: errorMessage,
        duration: 10000,
      })
      setIsDeploying(false)
    }
  }

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:border-primary text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>
      
      <div className="relative border-b border-border bg-card p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Deploy Contract</h1>
              <p className="text-sm text-muted-foreground">
                Write your Solidity smart contract and deploy to Paseo Asset Hub
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://faucet.polkadot.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
              >
                Get $PAS
              </a>
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50"
              >
                <FileCode className="h-4 w-4" />
                {isCompiling ? "Compiling..." : "Compile"}
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying || !compilationOutput || !account}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={!account ? "Connect wallet to deploy" : !compilationOutput ? "Compile contract first" : ""}
              >
                <Rocket className="h-4 w-4" />
                {isDeploying ? "Deploying..." : "Deploy"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Settings Sidebar for ERC20 */}
        {selectedPreset === "ERC20" && showSettings && (
          <div className="w-full lg:w-80 flex flex-col border-r border-border bg-muted/30 overflow-auto">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <h2 className="text-sm font-semibold text-foreground">ERC20 Settings</h2>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-auto">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={erc20Settings.name}
                    onChange={(e) => updateERC20Setting("name", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol" className="text-xs">Symbol</Label>
                  <Input
                    id="symbol"
                    type="text"
                    value={erc20Settings.symbol}
                    onChange={(e) => updateERC20Setting("symbol", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premint" className="text-xs">Premint</Label>
                  <Input
                    id="premint"
                    type="number"
                    value={erc20Settings.premint}
                    onChange={(e) => updateERC20Setting("premint", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mintable"
                      checked={erc20Settings.mintable}
                      onCheckedChange={(checked) => updateERC20Setting("mintable", checked as boolean)}
                    />
                    <Label htmlFor="mintable" className="text-sm font-normal cursor-pointer">
                      Mintable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="burnable"
                      checked={erc20Settings.burnable}
                      onCheckedChange={(checked) => updateERC20Setting("burnable", checked as boolean)}
                    />
                    <Label htmlFor="burnable" className="text-sm font-normal cursor-pointer">
                      Burnable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pausable"
                      checked={erc20Settings.pausable}
                      onCheckedChange={(checked) => updateERC20Setting("pausable", checked as boolean)}
                    />
                    <Label htmlFor="pausable" className="text-sm font-normal cursor-pointer">
                      Pausable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="callback"
                      checked={erc20Settings.callback}
                      onCheckedChange={(checked) => updateERC20Setting("callback", checked as boolean)}
                    />
                    <Label htmlFor="callback" className="text-sm font-normal cursor-pointer">
                      Callback
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="permit"
                      checked={erc20Settings.permit}
                      onCheckedChange={(checked) => updateERC20Setting("permit", checked as boolean)}
                    />
                    <Label htmlFor="permit" className="text-sm font-normal cursor-pointer">
                      Permit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flashmint"
                      checked={erc20Settings.flashmint}
                      onCheckedChange={(checked) => updateERC20Setting("flashmint", checked as boolean)}
                    />
                    <Label htmlFor="flashmint" className="text-sm font-normal cursor-pointer">
                      Flash Minting
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Votes */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Votes</h3>
                <RadioGroup
                  value={erc20Settings.votes === false ? "none" : String(erc20Settings.votes)}
                  onValueChange={(value) => updateERC20Setting("votes", value === "none" ? false : value as "blocknumber" | "timestamp")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="votes-none" />
                    <Label htmlFor="votes-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blocknumber" id="votes-block" />
                    <Label htmlFor="votes-block" className="text-sm font-normal cursor-pointer">
                      Block Number
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="timestamp" id="votes-timestamp" />
                    <Label htmlFor="votes-timestamp" className="text-sm font-normal cursor-pointer">
                      Timestamp
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Cross-Chain Bridging */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Cross-Chain Bridging</h3>
                <RadioGroup
                  value={erc20Settings.crossChainBridging === false ? "none" : erc20Settings.crossChainBridging}
                  onValueChange={(value) => updateERC20Setting("crossChainBridging", value === "none" ? false : value as "custom" | "superchain")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="bridging-none" />
                    <Label htmlFor="bridging-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="bridging-custom" />
                    <Label htmlFor="bridging-custom" className="text-sm font-normal cursor-pointer">
                      Custom
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="superchain" id="bridging-superchain" />
                    <Label htmlFor="bridging-superchain" className="text-sm font-normal cursor-pointer">
                      SuperchainERC20
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Access Control */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Access Control</h3>
                <RadioGroup
                  value={erc20Settings.access === false ? "none" : erc20Settings.access}
                  onValueChange={(value) => updateERC20Setting("access", value === "none" ? false : value as "ownable" | "roles" | "managed")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="access-none" />
                    <Label htmlFor="access-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ownable" id="access-ownable" />
                    <Label htmlFor="access-ownable" className="text-sm font-normal cursor-pointer">
                      Ownable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roles" id="access-roles" />
                    <Label htmlFor="access-roles" className="text-sm font-normal cursor-pointer">
                      Roles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="managed" id="access-managed" />
                    <Label htmlFor="access-managed" className="text-sm font-normal cursor-pointer">
                      Managed
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Info</h3>
                <div className="space-y-2">
                  <Label htmlFor="securityContact" className="text-xs">Security Contact</Label>
                  <Input
                    id="securityContact"
                    type="email"
                    value={erc20Settings.info.securityContact}
                    onChange={(e) => updateERC20Setting("info", { ...erc20Settings.info, securityContact: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license" className="text-xs">License</Label>
                  <Input
                    id="license"
                    type="text"
                    value={erc20Settings.info.license}
                    onChange={(e) => updateERC20Setting("info", { ...erc20Settings.info, license: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Sidebar for ERC721 */}
        {selectedPreset === "ERC721" && showSettings && (
          <div className="w-full lg:w-80 flex flex-col border-r border-border bg-muted/30 overflow-auto">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <h2 className="text-sm font-semibold text-foreground">ERC721 Settings</h2>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-auto">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="erc721-name" className="text-xs">Name</Label>
                  <Input
                    id="erc721-name"
                    type="text"
                    value={erc721Settings.name}
                    onChange={(e) => updateERC721Setting("name", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="erc721-symbol" className="text-xs">Symbol</Label>
                  <Input
                    id="erc721-symbol"
                    type="text"
                    value={erc721Settings.symbol}
                    onChange={(e) => updateERC721Setting("symbol", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="erc721-baseUri" className="text-xs">Base URI</Label>
                  <Input
                    id="erc721-baseUri"
                    type="text"
                    value={erc721Settings.baseUri}
                    onChange={(e) => updateERC721Setting("baseUri", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc721-mintable"
                      checked={erc721Settings.mintable}
                      onCheckedChange={(checked) => updateERC721Setting("mintable", checked as boolean)}
                    />
                    <Label htmlFor="erc721-mintable" className="text-sm font-normal cursor-pointer">
                      Mintable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc721-incremental"
                      checked={erc721Settings.incremental}
                      onCheckedChange={(checked) => updateERC721Setting("incremental", checked as boolean)}
                    />
                    <Label htmlFor="erc721-incremental" className="text-sm font-normal cursor-pointer">
                      Auto Increment Ids
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc721-burnable"
                      checked={erc721Settings.burnable}
                      onCheckedChange={(checked) => updateERC721Setting("burnable", checked as boolean)}
                    />
                    <Label htmlFor="erc721-burnable" className="text-sm font-normal cursor-pointer">
                      Burnable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc721-pausable"
                      checked={erc721Settings.pausable}
                      onCheckedChange={(checked) => updateERC721Setting("pausable", checked as boolean)}
                    />
                    <Label htmlFor="erc721-pausable" className="text-sm font-normal cursor-pointer">
                      Pausable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc721-enumerable"
                      checked={erc721Settings.enumerable}
                      onCheckedChange={(checked) => updateERC721Setting("enumerable", checked as boolean)}
                    />
                    <Label htmlFor="erc721-enumerable" className="text-sm font-normal cursor-pointer">
                      Enumerable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc721-uriStorage"
                      checked={erc721Settings.uriStorage}
                      onCheckedChange={(checked) => updateERC721Setting("uriStorage", checked as boolean)}
                    />
                    <Label htmlFor="erc721-uriStorage" className="text-sm font-normal cursor-pointer">
                      URI Storage
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Votes */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Votes</h3>
                <RadioGroup
                  value={erc721Settings.votes === false ? "none" : String(erc721Settings.votes)}
                  onValueChange={(value) => updateERC721Setting("votes", value === "none" ? false : value as "blocknumber" | "timestamp")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="erc721-votes-none" />
                    <Label htmlFor="erc721-votes-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blocknumber" id="erc721-votes-block" />
                    <Label htmlFor="erc721-votes-block" className="text-sm font-normal cursor-pointer">
                      Block Number
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="timestamp" id="erc721-votes-timestamp" />
                    <Label htmlFor="erc721-votes-timestamp" className="text-sm font-normal cursor-pointer">
                      Timestamp
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Access Control */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Access Control</h3>
                <RadioGroup
                  value={erc721Settings.access === false ? "none" : erc721Settings.access}
                  onValueChange={(value) => updateERC721Setting("access", value === "none" ? false : value as "ownable" | "roles" | "managed")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="erc721-access-none" />
                    <Label htmlFor="erc721-access-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ownable" id="erc721-access-ownable" />
                    <Label htmlFor="erc721-access-ownable" className="text-sm font-normal cursor-pointer">
                      Ownable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roles" id="erc721-access-roles" />
                    <Label htmlFor="erc721-access-roles" className="text-sm font-normal cursor-pointer">
                      Roles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="managed" id="erc721-access-managed" />
                    <Label htmlFor="erc721-access-managed" className="text-sm font-normal cursor-pointer">
                      Managed
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Info</h3>
                <div className="space-y-2">
                  <Label htmlFor="erc721-securityContact" className="text-xs">Security Contact</Label>
                  <Input
                    id="erc721-securityContact"
                    type="email"
                    value={erc721Settings.info.securityContact}
                    onChange={(e) => updateERC721Setting("info", { ...erc721Settings.info, securityContact: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="erc721-license" className="text-xs">License</Label>
                  <Input
                    id="erc721-license"
                    type="text"
                    value={erc721Settings.info.license}
                    onChange={(e) => updateERC721Setting("info", { ...erc721Settings.info, license: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Sidebar for ERC1155 */}
        {selectedPreset === "ERC1155" && showSettings && (
          <div className="w-full lg:w-80 flex flex-col border-r border-border bg-muted/30 overflow-auto">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <h2 className="text-sm font-semibold text-foreground">ERC1155 Settings</h2>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-auto">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="erc1155-name" className="text-xs">Name</Label>
                  <Input
                    id="erc1155-name"
                    type="text"
                    value={erc1155Settings.name}
                    onChange={(e) => updateERC1155Setting("name", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="erc1155-uri" className="text-xs">URI</Label>
                  <Input
                    id="erc1155-uri"
                    type="text"
                    value={erc1155Settings.uri}
                    onChange={(e) => updateERC1155Setting("uri", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc1155-mintable"
                      checked={erc1155Settings.mintable}
                      onCheckedChange={(checked) => updateERC1155Setting("mintable", checked as boolean)}
                    />
                    <Label htmlFor="erc1155-mintable" className="text-sm font-normal cursor-pointer">
                      Mintable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc1155-burnable"
                      checked={erc1155Settings.burnable}
                      onCheckedChange={(checked) => updateERC1155Setting("burnable", checked as boolean)}
                    />
                    <Label htmlFor="erc1155-burnable" className="text-sm font-normal cursor-pointer">
                      Burnable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc1155-supply"
                      checked={erc1155Settings.supply}
                      onCheckedChange={(checked) => updateERC1155Setting("supply", checked as boolean)}
                    />
                    <Label htmlFor="erc1155-supply" className="text-sm font-normal cursor-pointer">
                      Supply Tracking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc1155-pausable"
                      checked={erc1155Settings.pausable}
                      onCheckedChange={(checked) => updateERC1155Setting("pausable", checked as boolean)}
                    />
                    <Label htmlFor="erc1155-pausable" className="text-sm font-normal cursor-pointer">
                      Pausable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erc1155-updatableUri"
                      checked={erc1155Settings.updatableUri}
                      onCheckedChange={(checked) => updateERC1155Setting("updatableUri", checked as boolean)}
                    />
                    <Label htmlFor="erc1155-updatableUri" className="text-sm font-normal cursor-pointer">
                      Updatable URI
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Access Control */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Access Control</h3>
                <RadioGroup
                  value={erc1155Settings.access === false ? "none" : erc1155Settings.access}
                  onValueChange={(value) => updateERC1155Setting("access", value === "none" ? false : value as "ownable" | "roles" | "managed")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="erc1155-access-none" />
                    <Label htmlFor="erc1155-access-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ownable" id="erc1155-access-ownable" />
                    <Label htmlFor="erc1155-access-ownable" className="text-sm font-normal cursor-pointer">
                      Ownable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roles" id="erc1155-access-roles" />
                    <Label htmlFor="erc1155-access-roles" className="text-sm font-normal cursor-pointer">
                      Roles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="managed" id="erc1155-access-managed" />
                    <Label htmlFor="erc1155-access-managed" className="text-sm font-normal cursor-pointer">
                      Managed
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Info</h3>
                <div className="space-y-2">
                  <Label htmlFor="erc1155-securityContact" className="text-xs">Security Contact</Label>
                  <Input
                    id="erc1155-securityContact"
                    type="email"
                    value={erc1155Settings.info.securityContact}
                    onChange={(e) => updateERC1155Setting("info", { ...erc1155Settings.info, securityContact: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="erc1155-license" className="text-xs">License</Label>
                  <Input
                    id="erc1155-license"
                    type="text"
                    value={erc1155Settings.info.license}
                    onChange={(e) => updateERC1155Setting("info", { ...erc1155Settings.info, license: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Sidebar for Governor */}
        {selectedPreset === "Governor" && showSettings && (
          <div className="w-full lg:w-80 flex flex-col border-r border-border bg-muted/30 overflow-auto">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <h2 className="text-sm font-semibold text-foreground">Governor Settings</h2>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-auto">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="governor-name" className="text-xs">Name</Label>
                  <Input
                    id="governor-name"
                    type="text"
                    value={governorSettings.name}
                    onChange={(e) => updateGovernorSetting("name", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="governor-delay" className="text-xs">Voting Delay</Label>
                  <Input
                    id="governor-delay"
                    type="text"
                    value={governorSettings.delay}
                    onChange={(e) => updateGovernorSetting("delay", e.target.value)}
                    className="h-8"
                    placeholder="1 day"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="governor-period" className="text-xs">Voting Period</Label>
                  <Input
                    id="governor-period"
                    type="text"
                    value={governorSettings.period}
                    onChange={(e) => updateGovernorSetting("period", e.target.value)}
                    className="h-8"
                    placeholder="1 week"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="governor-threshold" className="text-xs">Proposal Threshold</Label>
                  <Input
                    id="governor-threshold"
                    type="text"
                    value={governorSettings.proposalThreshold || ""}
                    onChange={(e) => updateGovernorSetting("proposalThreshold", e.target.value)}
                    className="h-8"
                    placeholder="0"
                  />
                </div>
              </div>

              <Separator />

              {/* Votes */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Votes</h3>
                <RadioGroup
                  value={governorSettings.votes || "erc20votes"}
                  onValueChange={(value) => updateGovernorSetting("votes", value as "erc20votes" | "erc721votes")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="erc20votes" id="gov-votes-erc20" />
                    <Label htmlFor="gov-votes-erc20" className="text-sm font-normal cursor-pointer">
                      ERC20Votes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="erc721votes" id="gov-votes-erc721" />
                    <Label htmlFor="gov-votes-erc721" className="text-sm font-normal cursor-pointer">
                      ERC721Votes
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Timelock */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Timelock</h3>
                <RadioGroup
                  value={governorSettings.timelock === false ? "none" : governorSettings.timelock}
                  onValueChange={(value) => updateGovernorSetting("timelock", value === "none" ? false : value as "openzeppelin" | "compound")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="gov-timelock-none" />
                    <Label htmlFor="gov-timelock-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="openzeppelin" id="gov-timelock-oz" />
                    <Label htmlFor="gov-timelock-oz" className="text-sm font-normal cursor-pointer">
                      OpenZeppelin
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compound" id="gov-timelock-compound" />
                    <Label htmlFor="gov-timelock-compound" className="text-sm font-normal cursor-pointer">
                      Compound
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gov-storage"
                      checked={governorSettings.storage}
                      onCheckedChange={(checked) => updateGovernorSetting("storage", checked as boolean)}
                    />
                    <Label htmlFor="gov-storage" className="text-sm font-normal cursor-pointer">
                      Storage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gov-settings"
                      checked={governorSettings.settings}
                      onCheckedChange={(checked) => updateGovernorSetting("settings", checked as boolean)}
                    />
                    <Label htmlFor="gov-settings" className="text-sm font-normal cursor-pointer">
                      Settings
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Info</h3>
                <div className="space-y-2">
                  <Label htmlFor="governor-securityContact" className="text-xs">Security Contact</Label>
                  <Input
                    id="governor-securityContact"
                    type="email"
                    value={governorSettings.info.securityContact}
                    onChange={(e) => updateGovernorSetting("info", { ...governorSettings.info, securityContact: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="governor-license" className="text-xs">License</Label>
                  <Input
                    id="governor-license"
                    type="text"
                    value={governorSettings.info.license}
                    onChange={(e) => updateGovernorSetting("info", { ...governorSettings.info, license: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Sidebar for Custom */}
        {selectedPreset === "Custom" && showSettings && (
          <div className="w-full lg:w-80 flex flex-col border-r border-border bg-muted/30 overflow-auto">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <h2 className="text-sm font-semibold text-foreground">Custom Settings</h2>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-auto">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="custom-name" className="text-xs">Name</Label>
                  <Input
                    id="custom-name"
                    type="text"
                    value={customSettings.name}
                    onChange={(e) => updateCustomSetting("name", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="custom-pausable"
                      checked={customSettings.pausable}
                      onCheckedChange={(checked) => updateCustomSetting("pausable", checked as boolean)}
                    />
                    <Label htmlFor="custom-pausable" className="text-sm font-normal cursor-pointer">
                      Pausable
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Access Control */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Access Control</h3>
                <RadioGroup
                  value={customSettings.access === false ? "none" : customSettings.access}
                  onValueChange={(value) => updateCustomSetting("access", value === "none" ? false : value as "ownable" | "roles" | "managed")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="custom-access-none" />
                    <Label htmlFor="custom-access-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ownable" id="custom-access-ownable" />
                    <Label htmlFor="custom-access-ownable" className="text-sm font-normal cursor-pointer">
                      Ownable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roles" id="custom-access-roles" />
                    <Label htmlFor="custom-access-roles" className="text-sm font-normal cursor-pointer">
                      Roles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="managed" id="custom-access-managed" />
                    <Label htmlFor="custom-access-managed" className="text-sm font-normal cursor-pointer">
                      Managed
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Info</h3>
                <div className="space-y-2">
                  <Label htmlFor="custom-securityContact" className="text-xs">Security Contact</Label>
                  <Input
                    id="custom-securityContact"
                    type="email"
                    value={customSettings.info.securityContact}
                    onChange={(e) => updateCustomSetting("info", { ...customSettings.info, securityContact: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-license" className="text-xs">License</Label>
                  <Input
                    id="custom-license"
                    type="text"
                    value={customSettings.info.license}
                    onChange={(e) => updateCustomSetting("info", { ...customSettings.info, license: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Contract Editor</h2>
            </div>
            <div className="flex items-center gap-2">
              {(["ERC20", "ERC721", "ERC1155", "Governor", "Custom"] as ContractPreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedPreset === preset
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="sol"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
