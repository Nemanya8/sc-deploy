# Web3 Connect Implementation

A complete Polkadot wallet connection system for Next.js with shadcn/ui.

## Features

✅ **Multi-Wallet Support**
- Talisman
- SubWallet
- Polkadot{.js}
- Nova Wallet
- WalletConnect (coming soon)
- External Wallet (view-only mode)

✅ **Modern Stack**
- Next.js 15 with App Router
- TypeScript
- Zustand for state management
- TanStack Query for data fetching
- shadcn/ui components
- Tailwind CSS

✅ **Key Features**
- Persistent wallet connections (localStorage)
- Account selection from connected wallets
- Address formatting and validation
- Copy address to clipboard
- Disconnect functionality
- External address viewing (read-only)

## Project Structure

```
lib/web3/
├── constants/
│   ├── chains.ts          # Chain CAIP IDs
│   └── wallets.ts         # Wallet metadata
├── hooks/
│   ├── use-account.ts     # Get current account
│   ├── use-accounts.ts    # Fetch wallet accounts
│   ├── use-connect.ts     # Connect wallet
│   ├── use-disconnect.ts  # Disconnect wallet
│   └── use-wallet.ts      # Get current wallet
├── store/
│   └── use-web3-store.ts  # Zustand store
├── utils/
│   ├── address.ts         # SS58 encoding/validation
│   ├── format.ts          # Address formatting
│   └── validation.ts      # Input validation
└── wallets/
    ├── external-wallet.ts # View-only wallet
    └── index.ts           # Wallet registry

components/web3/
├── header/
│   ├── account-dropdown.tsx      # Connected account menu
│   └── web3-connect-button.tsx   # Connect button
├── modal/
│   ├── account-select.tsx        # Account selection
│   ├── external-wallet-form.tsx  # External address input
│   ├── wallet-list.tsx           # Wallet grid
│   └── web3-connect-modal.tsx    # Main modal
└── providers/
    └── web3-provider.tsx         # React Query wrapper

types/
└── web3.ts                       # TypeScript types
```

## Usage

### Access Current Account

```tsx
import { useAccount } from "@/lib/web3/hooks/use-account"

function MyComponent() {
  const { account } = useAccount()

  return <div>{account?.address}</div>
}
```

### Connect to Wallet

The modal is automatically available via the header button. Alternatively:

```tsx
import { useWeb3Store } from "@/lib/web3/store/use-web3-store"

function MyComponent() {
  const { toggle } = useWeb3Store()

  return <button onClick={toggle}>Open Wallet Modal</button>
}
```

### Disconnect Wallet

```tsx
import { useDisconnect } from "@/lib/web3/hooks/use-disconnect"

function MyComponent() {
  const { disconnect } = useDisconnect()

  return <button onClick={() => disconnect()}>Disconnect</button>
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Dependencies

### Core
- `@talismn/connect-wallets` - Polkadot wallet abstraction
- `@polkadot/types` - Polkadot type system
- `@polkadot/util-crypto` - Address encoding utilities

### State & Data
- `zustand` - State management
- `@tanstack/react-query` - Data fetching

### Wallet Connect (Optional)
- `@walletconnect/sign-client`
- `@walletconnect/modal`
- `@walletconnect/types`

### UI
- `@radix-ui/*` - Headless UI components (via shadcn)
- `lucide-react` - Icons
- `tailwindcss` - Styling

## Extending

### Add a New Wallet

Wallets from `@talismn/connect-wallets` are automatically detected. To add custom wallets, edit:

```typescript
// lib/web3/wallets/index.ts
import { MyCustomWallet } from "./my-custom-wallet"

const myWallet = new MyCustomWallet()

export const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  ...baseWallets,
  { wallet: myWallet, type: WalletProviderType.MyCustomWallet }
]
```

### Add Wallet Metadata

```typescript
// lib/web3/constants/wallets.ts
export const WALLET_INFO: Record<WalletProviderType, {...}> = {
  [WalletProviderType.MyCustomWallet]: {
    name: "My Wallet",
    description: "Description",
    downloadUrl: "https://..."
  }
}
```

## Notes

- All addresses are converted to generic SS58 format (prefix 42) for display
- Wallet state persists across page reloads
- External wallet mode is read-only and doesn't require extension installation
- The modal supports multi-step flows: Wallet Select → Account Select

## Future Enhancements

- [ ] WalletConnect full implementation with Polkadot namespace
- [ ] Account balance display
- [ ] Network switching
- [ ] Transaction signing
- [ ] Address book integration
