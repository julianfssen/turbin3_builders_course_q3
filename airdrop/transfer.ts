import {
    Transaction,
    SystemProgram,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    PublicKey,
} from '@solana/web3.js'
import wallet from './dev-wallet.json'
import { DEVNET_RPC_URL } from './constants'

// TODO: Probably better to put this in a secret or ENV variable
const WBA_DEVNET_WALLET_ADDRESS = 'FyScGJc8PWZGs2XVTZyNdkDyfKmiyvKLuuAUxiHAPPKL'

// NOTE: This is kept in for reference in case we need to transfer a certain
// amount instead of everything
async function transfer() {
    try {
        const from = Keypair.fromSecretKey(new Uint8Array(wallet))
        const to = new PublicKey(WBA_DEVNET_WALLET_ADDRESS)
        const connection = new Connection(DEVNET_RPC_URL)

        const transaction = new Transaction()
        const solToTransfer = 0.1

        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: solToTransfer * LAMPORTS_PER_SOL,
            })
        )

        const { blockhash } = await connection.getLatestBlockhash('confirmed')
        transaction.recentBlockhash = blockhash
        transaction.feePayer = from.publicKey

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        console.log(
            `Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`
        )
    } catch (err) {
        console.log('Failed to run transfer tokens program: ', err)
    }
}

async function transferAll() {
    try {
        const from = Keypair.fromSecretKey(new Uint8Array(wallet))
        const to = new PublicKey(WBA_DEVNET_WALLET_ADDRESS)
        const connection = new Connection(DEVNET_RPC_URL)

        const balance = await connection.getBalance(from.publicKey)

        const transaction = new Transaction()
        // Temporarily add transfer instruction to calculate transaction fee
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance,
            })
        )

        const { blockhash } = await connection.getLatestBlockhash('confirmed')
        transaction.recentBlockhash = blockhash
        transaction.feePayer = from.publicKey

        const { value } = await connection.getFeeForMessage(
            transaction.compileMessage(),
            'confirmed'
        )
        const fee = value || 0

        // Remove the instruction added above so we can add the "real" instruction with
        // the right amount of lamports after fees
        transaction.instructions.pop()

        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            })
        )

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        console.log(
            `Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`
        )
    } catch (err) {
        console.log('Failed to run transfer tokens program: ', err)
    }
}

transferAll()
