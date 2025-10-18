"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import Link from "next/link"
import { Rocket, Upload, FileCode, ArrowLeft, Settings } from "lucide-react"
import contractPresets from "@/lib/contract-presets.json"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

type ContractPreset = "ERC20" | "ERC721" | "ERC1155" | "Custom"

const PRESET_CONTRACTS = contractPresets as Record<ContractPreset, string>

type VoteType = "none" | "block" | "timestamp"
type AccessControl = "none" | "ownable" | "roles" | "managed"
type Upgradeability = "none" | "transparent" | "uups"

interface ERC20Settings {
  name: string
  symbol: string
  premint: string
  mintable: boolean
  burnable: boolean
  pausable: boolean
  callback: boolean
  permit: boolean
  flashMinting: boolean
  votes: VoteType
  bridging: boolean
  superchainERC20: boolean
  accessControl: AccessControl
  upgradeability: Upgradeability
  securityContact: string
  license: string
}

interface ERC721Settings {
  name: string
  symbol: string
  baseURI: string
  mintable: boolean
  autoIncrementIds: boolean
  burnable: boolean
  pausable: boolean
  enumerable: boolean
  uriStorage: boolean
  votes: VoteType
  accessControl: AccessControl
  upgradeability: Upgradeability
  securityContact: string
  license: string
}

interface ERC1155Settings {
  name: string
  uri: string
  mintable: boolean
  burnable: boolean
  supplyTracking: boolean
  pausable: boolean
  updatableURI: boolean
  accessControl: AccessControl
  upgradeability: Upgradeability
  securityContact: string
  license: string
}

export default function DeployPage() {
  const [selectedPreset, setSelectedPreset] = useState<ContractPreset>("ERC20")
  const [code, setCode] = useState(PRESET_CONTRACTS.ERC20)
  const [isCompiling, setIsCompiling] = useState(false)
  const [showSettings, setShowSettings] = useState(true)

  const [erc20Settings, setErc20Settings] = useState<ERC20Settings>({
    name: "MyToken",
    symbol: "MTK",
    premint: "0",
    mintable: false,
    burnable: false,
    pausable: false,
    callback: false,
    permit: false,
    flashMinting: false,
    votes: "none",
    bridging: false,
    superchainERC20: false,
    accessControl: "none",
    upgradeability: "none",
    securityContact: "security@example.com",
    license: "MIT"
  })

  const [erc721Settings, setErc721Settings] = useState<ERC721Settings>({
    name: "MyToken",
    symbol: "MTK",
    baseURI: "https://...",
    mintable: false,
    autoIncrementIds: false,
    burnable: false,
    pausable: false,
    enumerable: false,
    uriStorage: false,
    votes: "none",
    accessControl: "none",
    upgradeability: "none",
    securityContact: "security@example.com",
    license: "MIT"
  })

  const [erc1155Settings, setErc1155Settings] = useState<ERC1155Settings>({
    name: "MyToken",
    uri: "https://...",
    mintable: false,
    burnable: false,
    supplyTracking: false,
    pausable: false,
    updatableURI: false,
    accessControl: "none",
    upgradeability: "none",
    securityContact: "security@example.com",
    license: "MIT"
  })

  const handlePresetChange = (preset: ContractPreset) => {
    setSelectedPreset(preset)
    if (preset === "Custom") {
      setCode(PRESET_CONTRACTS[preset])
      setShowSettings(false)
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
    const { name, symbol, premint, mintable, burnable, pausable, permit, flashMinting, votes, accessControl, upgradeability, securityContact, license } = erc20Settings

    let imports = ""
    let inheritance = ["ERC20"]
    let constructor_params = [`string memory _name`, `string memory _symbol`]
    let constructor_body = `ERC20(_name, _symbol)`
    let additional_functions = ""
    let state_variables = ""

    // Features
    if (mintable) {
      inheritance.push("ERC20Mintable")
      additional_functions += `\n    function mint(address to, uint256 amount) public onlyOwner {\n        _mint(to, amount);\n    }\n`
    }

    if (burnable) {
      inheritance.push("ERC20Burnable")
      additional_functions += `\n    function burn(uint256 amount) public {\n        _burn(msg.sender, amount);\n    }\n\n    function burnFrom(address account, uint256 amount) public {\n        _spendAllowance(account, msg.sender, amount);\n        _burn(account, amount);\n    }\n`
    }

    if (pausable) {
      inheritance.push("Pausable")
      additional_functions += `\n    function pause() public onlyOwner {\n        _pause();\n    }\n\n    function unpause() public onlyOwner {\n        _unpause();\n    }\n\n    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {\n        super._beforeTokenTransfer(from, to, amount);\n    }\n`
    }

    if (permit) {
      inheritance.push("ERC20Permit")
      constructor_body += `, ERC20Permit(_name)`
    }

    if (flashMinting) {
      inheritance.push("ERC20FlashMint")
    }

    // Votes
    if (votes === "block") {
      inheritance.push("ERC20Votes")
      constructor_body += `, EIP712(_name, "1")`
    } else if (votes === "timestamp") {
      inheritance.push("ERC20VotesTimestamp")
      constructor_body += `, EIP712(_name, "1")`
    }

    // Access Control
    if (accessControl === "ownable") {
      inheritance.push("Ownable")
      constructor_body += `, Ownable(msg.sender)`
    } else if (accessControl === "roles") {
      inheritance.push("AccessControl")
      state_variables += `\n    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");\n    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");\n`
      constructor_body += `\n        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);\n        _grantRole(MINTER_ROLE, msg.sender);`
    }

    // Upgradeability
    if (upgradeability === "transparent" || upgradeability === "uups") {
      inheritance.push("Initializable")
      inheritance.push("UUPSUpgradeable")
      additional_functions += `\n    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}\n`
    }

    // Premint
    if (premint && parseInt(premint) > 0) {
      constructor_body += `\n        _mint(msg.sender, ${premint} * 10 ** decimals());`
    }

    const contract = `// SPDX-License-Identifier: ${license}
pragma solidity ^0.8.20;

contract ${name.replace(/\s+/g, '')} is ${inheritance.join(", ")} {${state_variables}

    constructor(${constructor_params.join(", ")}) ${constructor_body} {}${additional_functions}
}
`

    setCode(contract)
  }

  const generateERC721Contract = () => {
    const { name, symbol, baseURI, mintable, autoIncrementIds, burnable, pausable, enumerable, uriStorage, votes, accessControl, upgradeability, license } = erc721Settings

    let inheritance = ["ERC721"]
    let constructor_params = [`string memory _name`, `string memory _symbol`]
    let constructor_body = `ERC721(_name, _symbol)`
    let additional_functions = ""
    let state_variables = ""

    // Features
    if (enumerable) {
      inheritance.push("ERC721Enumerable")
    }

    if (uriStorage) {
      inheritance.push("ERC721URIStorage")
    }

    if (mintable) {
      if (autoIncrementIds) {
        state_variables += `\n    uint256 private _tokenIdCounter;\n`
        additional_functions += `\n    function safeMint(address to) public onlyOwner {\n        uint256 tokenId = _tokenIdCounter++;\n        _safeMint(to, tokenId);\n    }\n`
      } else {
        additional_functions += `\n    function safeMint(address to, uint256 tokenId) public onlyOwner {\n        _safeMint(to, tokenId);\n    }\n`
      }
    }

    if (burnable) {
      inheritance.push("ERC721Burnable")
    }

    if (pausable) {
      inheritance.push("Pausable")
      additional_functions += `\n    function pause() public onlyOwner {\n        _pause();\n    }\n\n    function unpause() public onlyOwner {\n        _unpause();\n    }\n`
    }

    // Votes
    if (votes === "block") {
      inheritance.push("ERC721Votes")
      constructor_body += `, EIP712(_name, "1")`
    } else if (votes === "timestamp") {
      inheritance.push("ERC721VotesTimestamp")
      constructor_body += `, EIP712(_name, "1")`
    }

    // Access Control
    if (accessControl === "ownable") {
      inheritance.push("Ownable")
      constructor_body += `, Ownable(msg.sender)`
    } else if (accessControl === "roles") {
      inheritance.push("AccessControl")
      state_variables += `\n    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");\n`
      constructor_body += `\n        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);\n        _grantRole(MINTER_ROLE, msg.sender);`
    }

    // Upgradeability
    if (upgradeability === "transparent" || upgradeability === "uups") {
      inheritance.push("Initializable")
      inheritance.push("UUPSUpgradeable")
      additional_functions += `\n    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}\n`
    }

    const contract = `// SPDX-License-Identifier: ${license}
pragma solidity ^0.8.20;

contract ${name.replace(/\s+/g, '')} is ${inheritance.join(", ")} {${state_variables}

    constructor(${constructor_params.join(", ")}) ${constructor_body} {}${additional_functions}
}
`

    setCode(contract)
  }

  const generateERC1155Contract = () => {
    const { name, uri, mintable, burnable, supplyTracking, pausable, updatableURI, accessControl, upgradeability, license } = erc1155Settings

    let inheritance = ["ERC1155"]
    let constructor_params = [`string memory _uri`]
    let constructor_body = `ERC1155(_uri)`
    let additional_functions = ""
    let state_variables = ""

    // Features
    if (supplyTracking) {
      inheritance.push("ERC1155Supply")
    }

    if (mintable) {
      additional_functions += `\n    function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyOwner {\n        _mint(to, id, amount, data);\n    }\n\n    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {\n        _mintBatch(to, ids, amounts, data);\n    }\n`
    }

    if (burnable) {
      inheritance.push("ERC1155Burnable")
    }

    if (pausable) {
      inheritance.push("Pausable")
      additional_functions += `\n    function pause() public onlyOwner {\n        _pause();\n    }\n\n    function unpause() public onlyOwner {\n        _unpause();\n    }\n`
    }

    if (updatableURI) {
      additional_functions += `\n    function setURI(string memory newuri) public onlyOwner {\n        _setURI(newuri);\n    }\n`
    }

    // Access Control
    if (accessControl === "ownable") {
      inheritance.push("Ownable")
      constructor_body += `, Ownable(msg.sender)`
    } else if (accessControl === "roles") {
      inheritance.push("AccessControl")
      state_variables += `\n    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");\n`
      constructor_body += `\n        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);\n        _grantRole(MINTER_ROLE, msg.sender);`
    }

    // Upgradeability
    if (upgradeability === "transparent" || upgradeability === "uups") {
      inheritance.push("Initializable")
      inheritance.push("UUPSUpgradeable")
      additional_functions += `\n    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}\n`
    }

    const contract = `// SPDX-License-Identifier: ${license}
pragma solidity ^0.8.20;

contract ${name.replace(/\s+/g, '')} is ${inheritance.join(", ")} {${state_variables}

    constructor(${constructor_params.join(", ")}) ${constructor_body} {}${additional_functions}
}
`

    setCode(contract)
  }

  useEffect(() => {
    if (selectedPreset === "ERC20") {
      generateERC20Contract()
    } else if (selectedPreset === "ERC721") {
      generateERC721Contract()
    } else if (selectedPreset === "ERC1155") {
      generateERC1155Contract()
    }
  }, [erc20Settings, erc721Settings, erc1155Settings, selectedPreset])

  const updateERC20Setting = <K extends keyof ERC20Settings>(key: K, value: ERC20Settings[K]) => {
    setErc20Settings(prev => ({ ...prev, [key]: value }))
  }

  const updateERC721Setting = <K extends keyof ERC721Settings>(key: K, value: ERC721Settings[K]) => {
    setErc721Settings(prev => ({ ...prev, [key]: value }))
  }

  const updateERC1155Setting = <K extends keyof ERC1155Settings>(key: K, value: ERC1155Settings[K]) => {
    setErc1155Settings(prev => ({ ...prev, [key]: value }))
  }

  const handleCompile = async () => {
    setIsCompiling(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsCompiling(false)
  }

  const handleDeploy = async () => {
    console.log("Deploying contract...")
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
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
              >
                <Rocket className="h-4 w-4" />
                Deploy
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
                      id="flashMinting"
                      checked={erc20Settings.flashMinting}
                      onCheckedChange={(checked) => updateERC20Setting("flashMinting", checked as boolean)}
                    />
                    <Label htmlFor="flashMinting" className="text-sm font-normal cursor-pointer">
                      Flash Minting
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Votes */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Votes</h3>
                <RadioGroup value={erc20Settings.votes} onValueChange={(value) => updateERC20Setting("votes", value as VoteType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="votes-none" />
                    <Label htmlFor="votes-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="block" id="votes-block" />
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
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bridging"
                      checked={erc20Settings.bridging}
                      onCheckedChange={(checked) => updateERC20Setting("bridging", checked as boolean)}
                    />
                    <Label htmlFor="bridging" className="text-sm font-normal cursor-pointer">
                      Custom
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="superchainERC20"
                      checked={erc20Settings.superchainERC20}
                      onCheckedChange={(checked) => updateERC20Setting("superchainERC20", checked as boolean)}
                    />
                    <Label htmlFor="superchainERC20" className="text-sm font-normal cursor-pointer">
                      SuperchainERC20
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Access Control */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Access Control</h3>
                <RadioGroup value={erc20Settings.accessControl} onValueChange={(value) => updateERC20Setting("accessControl", value as AccessControl)}>
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

              {/* Upgradeability */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Upgradeability</h3>
                <RadioGroup value={erc20Settings.upgradeability} onValueChange={(value) => updateERC20Setting("upgradeability", value as Upgradeability)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="upgrade-none" />
                    <Label htmlFor="upgrade-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="upgrade-transparent" />
                    <Label htmlFor="upgrade-transparent" className="text-sm font-normal cursor-pointer">
                      Transparent
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uups" id="upgrade-uups" />
                    <Label htmlFor="upgrade-uups" className="text-sm font-normal cursor-pointer">
                      UUPS
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
                    value={erc20Settings.securityContact}
                    onChange={(e) => updateERC20Setting("securityContact", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license" className="text-xs">License</Label>
                  <Input
                    id="license"
                    type="text"
                    value={erc20Settings.license}
                    onChange={(e) => updateERC20Setting("license", e.target.value)}
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
                  <Label htmlFor="erc721-baseURI" className="text-xs">Base URI</Label>
                  <Input
                    id="erc721-baseURI"
                    type="text"
                    value={erc721Settings.baseURI}
                    onChange={(e) => updateERC721Setting("baseURI", e.target.value)}
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
                      id="erc721-autoIncrementIds"
                      checked={erc721Settings.autoIncrementIds}
                      onCheckedChange={(checked) => updateERC721Setting("autoIncrementIds", checked as boolean)}
                    />
                    <Label htmlFor="erc721-autoIncrementIds" className="text-sm font-normal cursor-pointer">
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
                <RadioGroup value={erc721Settings.votes} onValueChange={(value) => updateERC721Setting("votes", value as VoteType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="erc721-votes-none" />
                    <Label htmlFor="erc721-votes-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="block" id="erc721-votes-block" />
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
                <RadioGroup value={erc721Settings.accessControl} onValueChange={(value) => updateERC721Setting("accessControl", value as AccessControl)}>
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

              {/* Upgradeability */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Upgradeability</h3>
                <RadioGroup value={erc721Settings.upgradeability} onValueChange={(value) => updateERC721Setting("upgradeability", value as Upgradeability)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="erc721-upgrade-none" />
                    <Label htmlFor="erc721-upgrade-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="erc721-upgrade-transparent" />
                    <Label htmlFor="erc721-upgrade-transparent" className="text-sm font-normal cursor-pointer">
                      Transparent
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uups" id="erc721-upgrade-uups" />
                    <Label htmlFor="erc721-upgrade-uups" className="text-sm font-normal cursor-pointer">
                      UUPS
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
                    value={erc721Settings.securityContact}
                    onChange={(e) => updateERC721Setting("securityContact", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="erc721-license" className="text-xs">License</Label>
                  <Input
                    id="erc721-license"
                    type="text"
                    value={erc721Settings.license}
                    onChange={(e) => updateERC721Setting("license", e.target.value)}
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
                      id="erc1155-supplyTracking"
                      checked={erc1155Settings.supplyTracking}
                      onCheckedChange={(checked) => updateERC1155Setting("supplyTracking", checked as boolean)}
                    />
                    <Label htmlFor="erc1155-supplyTracking" className="text-sm font-normal cursor-pointer">
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
                      id="erc1155-updatableURI"
                      checked={erc1155Settings.updatableURI}
                      onCheckedChange={(checked) => updateERC1155Setting("updatableURI", checked as boolean)}
                    />
                    <Label htmlFor="erc1155-updatableURI" className="text-sm font-normal cursor-pointer">
                      Updatable URI
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Access Control */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Access Control</h3>
                <RadioGroup value={erc1155Settings.accessControl} onValueChange={(value) => updateERC1155Setting("accessControl", value as AccessControl)}>
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

              {/* Upgradeability */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Upgradeability</h3>
                <RadioGroup value={erc1155Settings.upgradeability} onValueChange={(value) => updateERC1155Setting("upgradeability", value as Upgradeability)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="erc1155-upgrade-none" />
                    <Label htmlFor="erc1155-upgrade-none" className="text-sm font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="erc1155-upgrade-transparent" />
                    <Label htmlFor="erc1155-upgrade-transparent" className="text-sm font-normal cursor-pointer">
                      Transparent
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uups" id="erc1155-upgrade-uups" />
                    <Label htmlFor="erc1155-upgrade-uups" className="text-sm font-normal cursor-pointer">
                      UUPS
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
                    value={erc1155Settings.securityContact}
                    onChange={(e) => updateERC1155Setting("securityContact", e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="erc1155-license" className="text-xs">License</Label>
                  <Input
                    id="erc1155-license"
                    type="text"
                    value={erc1155Settings.license}
                    onChange={(e) => updateERC1155Setting("license", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col border-r border-border">
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Contract Editor</h2>
            </div>
            <div className="flex items-center gap-2">
              {(["ERC20", "ERC721", "ERC1155", "Custom"] as ContractPreset[]).map((preset) => (
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

        <div className="w-full lg:w-96 flex flex-col bg-muted/30">
          <div className="border-b border-border bg-muted/50 px-4 py-2">
            <h2 className="text-sm font-semibold text-foreground">Compilation Output</h2>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {isCompiling ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Compiling contract...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        Ready to Compile
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Click the Compile button to compile your Solidity contract.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Contract Info</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="text-foreground font-mono">Solidity</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target:</span>
                      <span className="text-foreground font-mono">Paseo Asset Hub</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lines:</span>
                      <span className="text-foreground font-mono">{code.split('\n').length}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="block w-full px-6 py-3 text-center bg-background border border-border rounded-lg hover:border-primary hover:bg-primary hover:text-primary-foreground text-foreground transition-colors font-medium"
                >
                  Dashboard
                </Link>

                <a
                  href="https://discord.gg/polkadot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 text-center bg-background border border-border rounded-lg hover:border-primary hover:bg-primary hover:text-primary-foreground text-foreground transition-colors font-medium"
                >
                  Get Help
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
