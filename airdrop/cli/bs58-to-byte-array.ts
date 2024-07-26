import bs58 from "bs58";
import Prompt from "prompt-sync";

try {
  const prompt = Prompt();
  const secretKey = prompt("Enter your Solana wallet secret key (in base-58 format): ");
  const bytes = bs58.decode(secretKey);
  console.log("Your byte array private key: ", bytes);
} catch (err) {
  console.error("Failed to convert bs58 to byte array", err);
}
