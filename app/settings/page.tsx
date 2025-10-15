import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
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
      
      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center px-8">
        <div 
          className="text-center transform -rotate-12"
          style={{ transformOrigin: 'center' }}
        >
          <h1 className="text-8xl md:text-9xl font-bold text-primary/20 border-8 border-primary/30 px-12 py-8 rounded-lg uppercase tracking-widest">
            Coming Soon
          </h1>
        </div>
      </div>
    </div>
  )
}

