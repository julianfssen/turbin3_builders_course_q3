import bs58 from "bs58";
import Prompt from "prompt-sync";

try {
  const prompt = Prompt();
  const secretKey = prompt("Enter your Solana wallet secret key (in byte array format): ");
  const bytes = JSON.parse(secretKey) as number[];
  const base58 = bs58.encode(bytes);
  console.log("Your base-58 private key: ", base58);
} catch (err) {
  console.error("Failed to convert byte array to bs58", err);
}
