"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, LayoutDashboard, Rocket, FileCode, BarChart3, Settings, Menu, X } from "lucide-react"
import { Web3ConnectButton } from "@/lib/web3/components/button/web3-connect-button"

const menuItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
    external: false,
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    external: false,
  },
  {
    title: "Deploy",
    icon: Rocket,
    href: "/deploy",
    external: false,
  },
  {
    title: "My Contracts",
    icon: FileCode,
    href: "/my-contracts",
    external: false,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "https://data.parity.io/polkadothub?relay-chain=paseo&chains=",
    external: true,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    external: false,
  },
]

export function NavMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Menu Button - Fixed on Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-background border border-border rounded-lg hover:border-primary"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Menu from Right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-bold text-foreground">
              dApp Pad
            </h2>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              if (item.external) {
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </a>
                )
              }
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer with Wallet Connect */}
          <div className="border-t border-border p-4">
            <Web3ConnectButton className="w-full" />
          </div>
        </div>
      </div>
    </>
  )
}

