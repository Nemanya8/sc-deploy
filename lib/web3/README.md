# Web3 Wallet Connection - Plug & Play

A fully plug-and-play Substrate wallet connection library with support for multiple wallets and beautiful UI components.

## Features

- 🔌 **Plug & Play** - Drop into any Next.js/React project
- 💼 **Multi-Wallet Support** - Talisman, Polkadot.js, SubWallet, Nova Wallet, WalletConnect
- 🎨 **Beautiful Avatars** - Polkadot circles and Talisman gradient avatars
- 🔒 **External Wallet** - View-only mode for any address
- 📱 **Responsive** - Works on desktop and mobile
- 🎯 **TypeScript** - Full type safety
- 🎨 **Customizable** - Accepts className and variant props

## Installation

### 1. Install Dependencies

```bash
npm install @talismn/connect-wallets @polkadot/util-crypto @polkadot/ui-shared @tanstack/react-query zustand color md5 jdenticon
npm install --save-dev @types/md5 @types/color
```

### 2. Copy the `lib/web3` Directory

Copy the entire `lib/web3` directory into your project.

### 3. Setup Provider

Wrap your app with the `Web3Provider`:

```tsx
import { Web3Provider } from "@/lib/web3"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
```

## Usage

### Basic Connect Button

```tsx
import { Web3ConnectButton } from "@/lib/web3"

export default function Page() {
  return <Web3ConnectButton />
}
```

### With Custom Styling

```tsx
<Web3ConnectButton
  className="fixed top-4 right-4"
  variant="outline"
/>
```

### In a Sidebar

```tsx
import { SidebarWeb3ConnectButton } from "@/lib/web3"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarFooter>
        <SidebarWeb3ConnectButton />
      </SidebarFooter>
    </Sidebar>
  )
}
```

### Using the Account Hook

```tsx
import { useAccount } from "@/lib/web3"

export function MyComponent() {
  const { account } = useAccount()

  if (!account) return <div>Not connected</div>

  return (
    <div>
      <p>Address: {account.address}</p>
      <p>Name: {account.name}</p>
      <p>Provider: {account.provider}</p>
    </div>
  )
}
```

### Manual Connection

```tsx
import { useConnect, useDisconnect, WalletProviderType } from "@/lib/web3"

export function CustomConnect() {
  const { mutate: connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div>
      <button onClick={() => connect(WalletProviderType.Talisman)}>
        Connect Talisman
      </button>
      <button onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  )
}
```

### Account Avatar

```tsx
import { AccountAvatar } from "@/lib/web3"

export function Profile({ account }) {
  return (
    <AccountAvatar
      address={account.address}
      provider={account.provider}
      size={64}
      className="rounded-lg"
    />
  )
}
```

## Components

### Buttons
- `Web3ConnectButton` - Standalone connect button
- `SidebarWeb3ConnectButton` - Sidebar-specific connect button
- `AccountDropdown` - Account dropdown menu
- `SidebarAccountDropdown` - Sidebar-specific account dropdown

### Modals
- `Web3ConnectModal` - Main wallet connection modal
- `WalletList` - List of available wallets
- `AccountSelect` - Account selection UI
- `ExternalWalletForm` - External wallet address input

### UI Components
- `AccountAvatar` - Address-based avatar (Polkadot or Talisman style)
- `PolkadotAvatar` - Polkadot circle avatar
- `TalismanAvatar` - Talisman gradient avatar

### Provider
- `Web3Provider` - Wraps QueryClientProvider and includes modal

## Hooks

- `useAccount()` - Get current connected account
- `useConnect()` - Connect to a wallet
- `useDisconnect()` - Disconnect wallet
- `useWalletAccounts(provider)` - Get accounts from a wallet
- `useWeb3Store()` - Access raw zustand store

## Types

```typescript
enum WalletProviderType {
  PolkadotJS = "polkadot-js",
  Talisman = "talisman",
  SubwalletJS = "subwallet-js",
  NovaWallet = "nova-wallet",
  WalletConnect = "walletconnect",
  ExternalWallet = "external",
}

enum WalletProviderStatus {
  Connected = "connected",
  Pending = "pending",
  Disconnected = "disconnected",
  Error = "error",
}

type Account = {
  name: string
  address: string
  displayAddress?: string
  genesisHash?: `0x${string}`
  provider: WalletProviderType
  isExternalWalletConnected?: boolean
}
```

## Utilities

- `shortenAddress(address, startLength?, endLength?)` - Shorten an address
- `toGenericSubstrateAddress(address)` - Convert to generic Substrate address
- `getSupportedWallets()` - Get list of supported wallets
- `getWalletByType(type)` - Get wallet by provider type

## Constants

- `POLKADOT_APP_NAME` - App name for wallet connection
- `POLKADOT_CAIP_ID_MAP` - Chain ID mappings
- `SUPPORTED_WALLETS` - Array of supported wallet types
- `WALLET_INFO` - Wallet metadata (name, description, download URL)

## State Persistence

The wallet connection state is automatically persisted to localStorage using zustand's persist middleware. The following data is stored:
- Connected account
- Recent provider
- Provider statuses

## Customization

All components accept standard React props:
- `className` - Tailwind CSS classes
- `variant` - Button variants (for connect buttons)
- `size` - Avatar sizes

## Example: Full Integration

```tsx
// app/layout.tsx
import { Web3Provider } from "@/lib/web3"

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Web3Provider>
          <Header />
          <main>{children}</main>
        </Web3Provider>
      </body>
    </html>
  )
}

// components/header.tsx
import { Web3ConnectButton } from "@/lib/web3"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <Web3ConnectButton variant="outline" />
    </header>
  )
}

// app/dashboard/page.tsx
import { useAccount } from "@/lib/web3"

export default function Dashboard() {
  const { account } = useAccount()

  if (!account) {
    return <div>Please connect your wallet</div>
  }

  return (
    <div>
      <h1>Welcome, {account.name}!</h1>
      <p>Address: {account.address}</p>
    </div>
  )
}
```

## License

MIT
