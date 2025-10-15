import Link from "next/link"
import { BookOpen, BarChart3, MessageCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h1 className="text-8xl md:text-9xl font-bold text-primary text-center">
            dApp Pad
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto text-center">
            Deploy a smart contract on Polkadot Hub{" "}
            <span className="text-primary font-semibold">within minutes</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link
              href="/deploy"
              className="px-12 py-4 text-lg font-bold border border-border rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors w-full sm:w-auto"
            >
              Deploy
            </Link>
            
            <Link
              href="/my-contracts"
              className="px-12 py-4 text-lg font-bold border border-border rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors w-full sm:w-auto"
            >
              Explore
            </Link>
            
            <a
              href="#resources"
              className="px-12 py-4 text-lg font-bold border border-border rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors w-full sm:w-auto"
            >
              Learn
            </a>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="relative px-8 py-24 mt-20 mb-40">
        <div className="relative max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-6xl md:text-7xl font-bold text-primary">Learn More</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Documentation Card */}
            <a
              href="https://docs.polkadot.com/develop/smart-contracts/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border rounded-lg p-8 hover:border-primary transition-colors text-center"
            >
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Documentation
              </h3>
              <p className="text-muted-foreground">
                Access comprehensive guides and tutorials to get started
              </p>
            </a>

            {/* Analytics Card */}
            <a
              href="https://data.parity.io/polkadothub?relay-chain=paseo&chains="
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border rounded-lg p-8 hover:border-primary transition-colors text-center"
            >
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Analytics
              </h3>
              <p className="text-muted-foreground">
                View real-time network statistics and blockchain data
              </p>
            </a>

            {/* Speak to an Expert Card */}
            <a
              href="https://discord.gg/polkadot"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border rounded-lg p-8 hover:border-primary transition-colors text-center"
            >
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Speak to an Expert
              </h3>
              <p className="text-muted-foreground">
                Get personalized support from our team of blockchain experts
              </p>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
