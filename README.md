# OPConnect

OPConnect is a powerful [React](https://reactjs.org/) component library for connecting a wallet to your dApp. It supports the most popular connectors and chains out of the box and provides a beautiful, seamless experience.

## Features

- 🔐 Simple Auth - Batteries included wallet connect and authentication.
- 💡 TypeScript Ready — Get types straight out of the box.
- 🌱 Ecosystem Standards — Uses top libraries such as [wagmi](https://github.com/wagmi-dev/wagmi).
- 🖥️ Simple UX — Give users a simple, attractive experience.
- 🌞🌚 Light/Dark/Auto Modes — Predesigned color themes.

and much more...

## Packages

- [`opconnect`](packages/opconnect) - Wallet connect modal and button components.
- [`opconnect-next-siwop`](packages/opconnect-next-siwop) - Authenticate your users using their [Other Page](https://other.page) accounts.
- [`opconnect-next-siwe`](packages/opconnect-next-siwe) - Authenticate your users using an Ethereum Signature.

## Quick Start

Get started with a OPConnect + [wagmi](https://wagmi.sh/) + [viem](https://viem.sh) project by running one of the following in your terminal:

#### npm

```sh
npx create-react-app my-app --template cra-template-opconnect
```

#### yarn

```sh
yarn create react-app my-app --template cra-template-opconnect
```

#### pnpm

```sh
pnpm dlx create-react-app ./my-app --template cra-template-opconnect
```

## Getting Started

OPConnect is the simplest way to integrate a connect wallet experience into your React.js web application. It comes with sensible defaults out of the box so you can focus on building.

## 1\. Install

Install OPConnect and its peer dependencies:

```bash
npm install opconnect wagmi viem@2.x @tanstack/react-query
```

- [Wagmi](https://wagmi.sh/) is a React Hooks library for Ethereum, this is the library you will use to interact with the connected wallet.

- [Viem](https://viem.sh/) is a TypeScript interface for Ethereum that performs blockchain operations.

- [TanStack Query](https://tanstack.com/query/v5) is an async state manager that handles requests, caching, and more.

- [TypeScript](https://wagmi.sh/react/typescript) is optional, but highly recommended.

## 2\. API Keys

**Sign In With Other Page (SIWOP)**

If you intend to use Sign in With Other Page (SIWOP) to log users into your app, you will need to create a connect app in the [Other Page Community Dashboard](https://alpha-admin.other.page) and set the require configuration. See: [examples/nextjs-siwop/README.md](examples/nextjs-siwop/README.md) for a list.

**WalletConnect 2.0**

OPConnect utilises WalletConnect's SDK to help with connecting wallets. If you wish to use WalletConnect 2.0, it requires a `walletConnectProjectId` which you can create quickly and easily for free over at [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in).

## 3\. Implementation

It is recommended to wrap your app within a new component that will help you set up OPConnect and its dependencies.

Start by creating a new component called `Web3Provider`. Here you will import the required providers and create a config using wagmi's [createConfig](https://wagmi.sh/react/api/createConfig) method. OPConnect supplies a pre-configured `getDefaultConfig` function to simplify the process of creating a config.

Below is a simple example app using `getDefaultConfig()` to help you get started:

_When using a framework that supports [React Server Components](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks), you will need to include the `"use client"` directive at the beginning of this file._

```javascript
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OPConnectProvider, getDefaultConfig } from 'opconnect';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: 'Your App Name',
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OPConnectProvider>{children}</OPConnectProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
```

Now that you have your `Web3Provider` component, you can wrap your app with it:

```javascript
import { Web3Provider } from './Web3Provider';
import { ConnectButton } from 'opconnect';

const App = () => {
  return (
    <Web3Provider>
      <ConnectButton />
    </Web3Provider>
  );
};
```

## 4\. Connected Wallet Info

In a lot of use cases, you will want to access the connected wallet from OPConnect in order to be able to interact with it further. You can do so by using the different hooks, such as [useAccount](https://wagmi.sh/docs/hooks/useAccount), from wagmi (a OPConnect dependency).

In the previous example above we wrapped our app with a <OPConnectProvider> top-level. Before utilizing any wagmi hook, make sure the components you build are mounted under this provider.

Below is a simple example component that utilizes the useAccount hook to access connection state and the connected wallet address:

```javascript
import { useAccount } from 'wagmi';

// Make sure that this component is wrapped with OPConnectProvider
const MyComponent = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return <div>Connected Wallet: {address}</div>;
};
```

## 5\. Sign In With Other Page (SIWOP)

[Sign in With Other Page](packages/opconnect-next-siwop/README.md) acts as a drop in replacement of other forms of authentication for your app. Using SIWOP enables your users to login once across all of your apps and bring their avatars and profile data with them.


## Additional Build Tooling Setup

Some build tools require additional setup to work with ConnectKit.

[](https://docs.family.co/connectkit/getting-started#getting-started-nextjs)

### Next.js

OPConnect uses [WalletConnect](https://walletconnect.com/)'s SDK to help with connecting wallets. WalletConnect 2.0 pulls in Node.js dependencies that Next.js does not support by default.

You can mitigate this by adding the following to your `next.config.js` file:

```javascript
module.exports = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};
```

### Next.js App Router

If using Next.js App Router, or any framework that supports React Server Components, you will need to include the `"use client"` directive at the beginning of your `Web3Provider` file.

```javascript
"use client"

...

export const Web3Provider = ({ children }) => {
  return (
    ...
  );
};
```

## Examples

There are various runnable examples included in this repository in the [examples folder](https://github.com/cr3labs/opconnect/tree/main/examples):


- [Create React App Example (TypeScript)](https://github.com/cr3labs/opconnect/main/examples/cra)
- [Next.js Example (TypeScript)](https://github.com/cr3labs/opconnect/main/examples/nextjs)
- [Vite Example (TypeScript)](https://github.com/cr3labs/opconnect/main/examples/vite)

### Try in CodeSandbox

You can try out some OPConnect examples directly in your browser through CodeSandbox:

- [Create React App Example (TypeScript)](https://codesandbox.io/s/5rhqm0?file=/README.md)
- [Next.js (TypeScript)](https://codesandbox.io/s/qnvyqe?file=/README.md)
- [Vite Example (TypeScript)](https://codesandbox.io/s/4jtssh?file=/README.md)

### Running Examples Locally

Clone the OPConnect project and install the necessary dependencies:

```sh
$ git clone git@github.com:cr3labs/opconnect.git
$ cd opconnect
$ yarn install
```

and start the code bundler:

```sh
$ yarn dev:opconnect
$ yarn dev:opconnect-next-siwe
```

and then simply select the example you'd like to run:

```sh
$ yarn dev:vite # Vite
$ yarn dev:nextjs # Next.js
$ yarn dev:nextjs-siwop # Next.js with SIWOP
$ yarn dev:nextjs-siwe # Next.js with SIWE
$ yarn dev:cra # Create React App
$ yarn dev:testbench # Testbench app
```
