# airdrop

`airdrop_program` is a Solana dApp (written in Rust) that interacts with the token program onchain.

This program is the prerequisite dApp for the first phase of the WBA Turbin3 program.

## Setup

1) Make sure you have `rust` and `cargo` installed
2) Run `cargo test` or `cargo test -- --nocapture` to print output

## Functions

### `keygen`

Runs the function to generate a public key and secret key (keypair) via `@solana/web3.js`

### `airdrop`

Runs the function to claim 2 SOL for the given wallet address (runs on devnet)

### `transfer`

Runs the function to transfer all of a wallet's SOL balance to another wallet address. The function also contains another function that transfers a set amount instead.

### `enroll`

Runs the function to interact with the WBA onchain program to enroll into the course. In short, it generates a PDA from the required seeds as well as passing in the user's Github username to the onchain program, which upon success, "enrolls" the user into the course. 

### `wallet-to-bs58`

Runs a function to convert a Solana wallet secret key (i.e. a byte array) into a base-58 encoded string.

### `bs58-to-wallet`

Runs a function to convert a base-58 encoded private key into a Solana wallet secret key (i.e. a byte array).
