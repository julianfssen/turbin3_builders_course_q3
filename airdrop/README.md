# airdrop

`airdrop` is a Solana dApp (written in Typescript) that interacts with the token program onchain.

This program is the prerequisite dApp for the first phase of the WBA Turbin3 program.

## Setup

1) Make sure you have `node` and `yarn` installed
2) Run `yarn install`

## Scripts

### yarn run `keygen`

Runs the script to generate a public key and secret key (keypair) via `@solana/web3.js`

### yarn run `airdrop`

Runs the script to claim 2 SOL for the given wallet address (runs on devnet)

### yarn run `transfer`

Runs the script to transfer all of a wallet's SOL balance to another wallet address. The script also contains another function that transfers a set amount instead.

### yarn run `enroll`

Runs the script to interact with the WBA onchain program to enroll into the course. In short, it generates a PDA from the required seeds as well as passing in the user's Github username to the onchain program, which upon success, "enrolls" the user into the course.

### yarn run `wallet-to-bs58`

Runs a script to convert a Solana wallet secret key (i.e. a byte array) into a base-58 encoded string.

### yarn run `bs58-to-wallet`

Runs a script to convert a base-58 encoded private key into a Solana wallet secret key (i.e. a byte array).
