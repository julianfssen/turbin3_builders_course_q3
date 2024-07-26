use {
    solana_client::rpc_client::RpcClient,
    solana_program::{
        pubkey::Pubkey,
        system_instruction::transfer,
    },
    solana_sdk::{
        message::Message,
        native_token::LAMPORTS_PER_SOL,
        signer::keypair::{Keypair, read_keypair_file},
        signer::Signer,
        system_program,
        transaction::Transaction,
    },
    std::str::FromStr,
    crate::cli::{bs58_to_wallet::bs58_to_wallet, wallet_to_bs58::wallet_to_bs58},
    crate::programs::wba_prereq::{WbaPrereqProgram, CompleteArgs}
};

mod cli;
mod programs;

const RPC_URL: &str = "https://api.devnet.solana.com";
const WBA_PUBKEY_ADDRESS: &str = "FyScGJc8PWZGs2XVTZyNdkDyfKmiyvKLuuAUxiHAPPKL";

pub fn keygen() {
    let keypair = Keypair::new();
    println!("You've generated a new Solana wallet: {}", keypair.pubkey().to_string());
    println!("");
    println!("To save your wallet, copy and paste the following into a JSON file:");
    println!("{:?}", keypair.to_bytes());
}

pub fn airdrop() {
    let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

    println!("Airdropping 2 SOL to {:?}", keypair.pubkey().to_string());
    let client = RpcClient::new(RPC_URL);

    let sol_to_claim = 2;
    match client.request_airdrop(&keypair.pubkey(), sol_to_claim * LAMPORTS_PER_SOL) {
        Ok(s) => {
            println!("Success! Check out your TX here:");
            println!("https://explorer.solana.com/tx/{}?cluster=devnet", s.to_string());
        },
        Err(e) => println!("Oops, something went wrong: {}", e.to_string())
    };
}

pub fn transfer_sol() {
    let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
    let to_pubkey = Pubkey::from_str(WBA_PUBKEY_ADDRESS).expect("Failed to parse pubkey");

    let client = RpcClient::new(RPC_URL);
    let recent_blockhash = client.get_latest_blockhash().expect("Failed to get recent blockhash");

    let sol_to_transfer = 0.1;
    let lamports_to_transfer = (sol_to_transfer * LAMPORTS_PER_SOL as f64) as u64;
    let instruction = transfer(&keypair.pubkey(), &to_pubkey, lamports_to_transfer);
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&keypair.pubkey()),
        &[keypair],
        recent_blockhash
    );

    let signature = client.send_and_confirm_transaction(&transaction).expect("Failed to send transaction");

    println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet", signature);
}

pub fn transfer_all_sol() {
    let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
    let to_pubkey = Pubkey::from_str(WBA_PUBKEY_ADDRESS).expect("Failed to parse pubkey");

    let client = RpcClient::new(RPC_URL);
    let balance = client.get_balance(&keypair.pubkey()).expect("Failed to get wallet balance");
    let recent_blockhash = client.get_latest_blockhash().expect("Failed to get recent blockhash");

    let message = Message::new_with_blockhash(
        &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
        Some(&keypair.pubkey()),
        &recent_blockhash
    );
    let fee = client.get_fee_for_message(&message).expect("Failed to calculate fees");

    let instruction = transfer(&keypair.pubkey(), &to_pubkey, balance - fee);
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&keypair.pubkey()),
        &[keypair],
        recent_blockhash
    );

    let signature = client.send_and_confirm_transaction(&transaction).expect("Failed to send transaction");

    println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet", signature);
}

pub fn enroll() {
    let client = RpcClient::new(RPC_URL);
    let signer = read_keypair_file("wba-wallet.json").expect("Couldn't find wallet file");

    let prereq_pda = WbaPrereqProgram::derive_program_address(&[b"prereq", signer.pubkey().to_bytes().as_ref()]);
    let complete_args = CompleteArgs {github: b"julianfssen".to_vec()};

    let recent_blockhash = client.get_latest_blockhash().expect("Failed to get recent blockhash");

    let transaction = WbaPrereqProgram::complete(
        &[&signer.pubkey(), &prereq_pda, &system_program::id()],
        &complete_args,
        Some(&signer.pubkey()),
        &[&signer],
        recent_blockhash
    );

    let signature = client.send_and_confirm_transaction(&transaction).expect("Failed to send transaction");

    // Print our transaction out
    println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet", signature);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keygen() {
        keygen();
    }

    #[test]
    fn test_airdrop() {
        airdrop();
    }

    #[test]
    fn test_transfer_sol() {
        transfer_sol();
    }

    #[test]
    fn test_transfer_all_sol() {
        transfer_all_sol();
    }

    #[test]
    fn test_enroll() {
        enroll();
    }

    // TODO: Refactor this test to not rely on manual stdin
    // #[test]
    // fn test_bs58_to_wallet() {
    //     bs58_to_wallet();
    // }

    // TODO: Refactor this test to not rely on manual stdin
    // #[test]
    // fn test_wallet_to_bs58() {
    //     wallet_to_bs58();
    // }
}
