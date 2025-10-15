"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
import Link from "next/link"
import { Rocket, Upload, FileCode, ArrowLeft } from "lucide-react"

const SAMPLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    event ValueChanged(uint256 newValue);

    constructor() {
        storedData = 0;
    }

    function set(uint256 x) public {
        storedData = x;
        emit ValueChanged(x);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
`

export default function DeployPage() {
  const [code, setCode] = useState(SAMPLE_CONTRACT)
  const [isCompiling, setIsCompiling] = useState(false)

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
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="border-b border-border bg-muted/50 px-4 py-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Contract Editor</h2>
              <button
                onClick={() => setCode(SAMPLE_CONTRACT)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Reset to Sample
              </button>
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
