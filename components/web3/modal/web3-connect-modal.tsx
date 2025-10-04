"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWeb3Store } from "@/lib/web3/store/use-web3-store"
import { WalletProviderType } from "@/types/web3"
import { useConnect } from "@/lib/web3/hooks/use-connect"
import { useWalletAccounts } from "@/lib/web3/hooks/use-accounts"
import { WalletList } from "./wallet-list"
import { AccountSelect } from "./account-select"
import { ExternalWalletForm } from "./external-wallet-form"
import { getWalletByType } from "@/lib/web3/wallets"
import { ExternalWallet } from "@/lib/web3/wallets/external-wallet"
import { ArrowLeft } from "lucide-react"
import { toGenericSubstrateAddress } from "@/lib/web3/utils/address"

type ModalStep = "wallet-select" | "account-select" | "external-form"

export function Web3ConnectModal() {
  const { open, toggle, setAccount } = useWeb3Store()
  const [step, setStep] = useState<ModalStep>("wallet-select")
  const [selectedWallet, setSelectedWallet] =
    useState<WalletProviderType | null>(null)

  const { mutate: connect } = useConnect()
  const { data: accounts = [], isLoading } = useWalletAccounts(selectedWallet)

  const handleSelectWallet = (type: WalletProviderType) => {
    if (type === WalletProviderType.ExternalWallet) {
      setSelectedWallet(type)
      setStep("external-form")
      return
    }

    setSelectedWallet(type)
    connect(type, {
      onSuccess: () => {
        setStep("account-select")
      },
    })
  }

  const handleSelectAccount = (account: typeof accounts[0]) => {
    setAccount(account)
    handleClose()
  }

  const handleExternalSubmit = async (address: string) => {
    const provider = getWalletByType(WalletProviderType.ExternalWallet)
    if (provider?.wallet instanceof ExternalWallet) {
      await provider.wallet.setAddress(address)
      const genericAddress = toGenericSubstrateAddress(address)
      setAccount({
        name: "External Account",
        address,
        displayAddress: genericAddress || address,
        provider: WalletProviderType.ExternalWallet,
        isExternalWalletConnected: true,
      })
      handleClose()
    }
  }

  const handleBack = () => {
    setStep("wallet-select")
    setSelectedWallet(null)
  }

  const handleClose = () => {
    toggle()
    setTimeout(() => {
      setStep("wallet-select")
      setSelectedWallet(null)
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {step !== "wallet-select" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle>
            {step === "wallet-select" && "Connect Wallet"}
            {step === "account-select" && "Select Account"}
            {step === "external-form" && "External Wallet"}
          </DialogTitle>
          <DialogDescription>
            {step === "wallet-select" &&
              "Choose a wallet to connect to this application"}
            {step === "account-select" &&
              "Select an account from your wallet"}
            {step === "external-form" &&
              "Enter a Substrate address to view (read-only)"}
          </DialogDescription>
        </DialogHeader>

        {step === "wallet-select" && (
          <WalletList onSelectWallet={handleSelectWallet} />
        )}

        {step === "account-select" && (
          <AccountSelect
            accounts={accounts}
            isLoading={isLoading}
            onSelectAccount={handleSelectAccount}
          />
        )}

        {step === "external-form" && (
          <ExternalWalletForm onSubmit={handleExternalSubmit} />
        )}
      </DialogContent>
    </Dialog>
  )
}
