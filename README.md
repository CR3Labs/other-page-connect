# OPConnect

OPConnect is a powerful [React](https://reactjs.org/) component library for connecting a wallet to your dApp. It supports the most popular connectors and chains out of the box and provides a beautiful, seamless experience.

## Features

- 💡 TypeScript Ready — Get types straight out of the box.
- 🌱 Ecosystem Standards — Uses top libraries such as [wagmi](https://github.com/wagmi-dev/wagmi).
- 🖥️ Simple UX — Give users a simple, attractive experience.
- 🌞🌚 Light/Dark/Auto Modes — Predesigned color themes.

and much more...

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

## Documentation

You can find the full OPConnect documentation in the Family docs [here](https://docs.family.co/connectkit).

## API Reference

You can find the full API Reference in the Family docs [here](https://docs.family.co/connectkit/api-reference).

## Examples

There are various runnable examples included in this repository in the [examples folder](https://github.com/solidity-io/canopy-wallet-connect/tree/main/examples):

- [Create React App Example (TypeScript)](https://github.com/solidity-io/canopy-wallet-connect/main/examples/cra)
- [Next.js Example (TypeScript)](https://github.com/solidity-io/canopy-wallet-connect/main/examples/nextjs)
- [Vite Example (TypeScript)](https://github.com/solidity-io/canopy-wallet-connect/main/examples/vite)

### Try in CodeSandbox

You can try out some OPConnect examples directly in your browser through CodeSandbox:

- [Create React App Example (TypeScript)](https://codesandbox.io/s/5rhqm0?file=/README.md)
- [Next.js (TypeScript)](https://codesandbox.io/s/qnvyqe?file=/README.md)
- [Vite Example (TypeScript)](https://codesandbox.io/s/4jtssh?file=/README.md)

### Running Examples Locally

Clone the OPConnect project and install the necessary dependencies:

```sh
$ git clone git@github.com/solidity-io/canopy-wallet-connect.git
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
$ yarn dev:nextjs-siwe # Next.js with SIWE
$ yarn dev:cra # Create React App
```
