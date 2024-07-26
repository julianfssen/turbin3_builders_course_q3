import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Program, Wallet, AnchorProvider } from '@coral-xyz/anchor'
import { IDL, WbaPrereq } from './programs/wba_prereq'
import { DEVNET_RPC_URL } from './constants'
import wallet from './wba-wallet.json'

const GITHUB_USERNAME = 'julianfssen'

try {
    const keypair = Keypair.fromSecretKey(new Uint8Array(wallet))
    const connection = new Connection(DEVNET_RPC_URL)

    const github = Buffer.from(GITHUB_USERNAME, 'utf8')
    const provider = new AnchorProvider(connection, new Wallet(keypair), {
        commitment: 'confirmed',
    })
    const program: Program<WbaPrereq> = new Program(IDL, provider)

    // Create the PDA for our enrollment account
    const enrollment_seeds = [
        Buffer.from('prereq'),
        keypair.publicKey.toBuffer(),
    ]
    const [enrollmentKey, _bump] = PublicKey.findProgramAddressSync(
        enrollment_seeds,
        program.programId
    )

    const enroll = async () => {
        try {
            const txhash = await program.methods
                .complete(github)
                .accounts({
                    signer: keypair.publicKey,
                })
                .signers([keypair])
                .rpc()

            console.log(
                `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
            )
        } catch (err) {
            console.error('Failed to interact with WBA onchain program: ', err)
        }
    }

    enroll()
} catch (err) {
    console.error('Failed to interact with WBA onchain program: ', err)
}
