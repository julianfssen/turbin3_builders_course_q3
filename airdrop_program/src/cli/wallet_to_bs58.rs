use {
    bs58,
    std::io::{self, BufRead}
};

pub fn wallet_to_bs58() {
    println!("Input your private key as a wallet file byte array:");

    let stdin = io::stdin();
    let mut handle = stdin.lock();

    let mut buffer = String::new();
    let result = handle.read_line(&mut buffer);
    match result {
        Ok(_) => (),
        Err(e) => panic!("Problem converting wallet file byte array to bs58: {e:?}")
    }

    println!("Your wallet file is:");
    let split: Vec<u8> = buffer
        .trim_start_matches('[')
        .trim_end_matches('\n')
        .trim_end_matches(']')
        .split(',')
        .map(|s| s.trim().parse::<u8>().unwrap())
        .collect();

    let bs58_wallet = bs58::encode(split).into_string();
    println!("Base-58 secret key: {:?}", bs58_wallet);
}
