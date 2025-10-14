import { PapiDemo } from "@/components/demo/papi-demo"
import { Web3ConnectButton } from "@/lib/web3/components/button/web3-connect-button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PapiDemo />
      <Web3ConnectButton className="fixed top-4 right-4" variant="default" />
    </div>
  )
}
