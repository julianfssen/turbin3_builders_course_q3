use {
    bs58,
    std::io::{self, BufRead}
};

pub fn bs58_to_wallet() {
    println!("Input your private key as base58:");
    let stdin = io::stdin();
    let mut handle = stdin.lock();

    let mut buffer = String::new();
    let result = handle.read_line(&mut buffer);
    match result {
        Ok(_) => (),
        Err(e) => panic!("Problem converting bs58 to wallet byte array: {e:?}")
    }

    println!("Your wallet file is:");
    let result = bs58::decode(buffer.trim_end_matches('\n')).into_vec();
    match result {
        Ok(wallet) => println!("{:?}", wallet),
        Err(e) => panic!("Problem converting bs58 to wallet byte array: {e:?}")
    }
}
