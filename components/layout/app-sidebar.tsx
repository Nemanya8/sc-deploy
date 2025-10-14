"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Rocket, FileCode, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { SidebarWeb3ConnectButton } from "@/components/web3/sidebar-web3-connect-button"

const menuItems = [
  {
    title: "Deploy",
    icon: Rocket,
    href: "/deploy",
  },
  {
    title: "My Contracts",
    icon: FileCode,
    href: "/my-contracts",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border flex flex-col h-screen">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <h2 className="text-lg font-bold text-sidebar-foreground">
          SC Deploy
        </h2>
      </SidebarHeader>

      <SidebarContent className="p-4 flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="lg" className="w-full">
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="w-full">
              <Link href="/settings" className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarWeb3ConnectButton />
      </SidebarFooter>
    </Sidebar>
  )
}
