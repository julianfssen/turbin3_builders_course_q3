import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import wallet from './dev-wallet.json'
import { DEVNET_RPC_URL } from './constants'

try {
    const keypair = Keypair.fromSecretKey(new Uint8Array(wallet))
    const connection = new Connection(DEVNET_RPC_URL)
    const solToClaim = 2

    const airdrop = async () => {
        try {
            const txhash = await connection.requestAirdrop(
                keypair.publicKey,
                solToClaim * LAMPORTS_PER_SOL
            )
            console.log(
                `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
            )
        } catch (err) {
            console.error('Failed to request airdrop', err)
        }
    }

    airdrop()
} catch (err) {
    console.error('Failed to request airdrop', err)
}
