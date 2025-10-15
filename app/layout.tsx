import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/lib/web3/components/providers/web3-provider";
import { NavMenu } from "@/components/layout/nav-menu";

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
      <body className="font-sans antialiased">
        <Web3Provider>
          <NavMenu />
          <main className="w-full">{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}
