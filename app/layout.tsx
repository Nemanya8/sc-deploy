import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/web3/providers/web3-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  weight: ["300", "400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Smart Contract Deploy",
  description: "Deploy smart contracts on Polkadot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${unbounded.variable} font-sans antialiased`}>
        <Web3Provider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full">{children}</main>
          </SidebarProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
