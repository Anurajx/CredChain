
const {
    Connection,
    PublicKey,
    Keypair,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction
  } = require("@solana/web3.js");
  
  // ============ CONFIGURATION ============
  
  // Change to "mainnet-beta" for production
  const NETWORK = "devnet";
  
  class SolanaBlockchain {
    constructor() {
      this.connection = new Connection(clusterApiUrl(NETWORK), "confirmed");
    }
  
    // ============ CREATE NEW WALLET ============
  
    createWallet() {
      const wallet = Keypair.generate();
  
      return {
        publicKey: wallet.publicKey.toString(),
        secretKey: Buffer.from(wallet.secretKey).toString("hex")
      };
    }
  
    // ============ GET BALANCE ============
  
    async getBalance(publicKeyString) {
      const publicKey = new PublicKey(publicKeyString);
      const balance = await this.connection.getBalance(publicKey);
  
      return balance / LAMPORTS_PER_SOL; // Convert to SOL
    }
  
    // ============ AIRDROP (DEVNET ONLY) ============
  
    async requestAirdrop(publicKeyString) {
      const publicKey = new PublicKey(publicKeyString);
  
      const signature = await this.connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      );
  
      await this.connection.confirmTransaction(signature);
  
      return signature;
    }
  
    // ============ SEND SOL ============
  
    async sendSOL(senderSecretHex, receiverPublicKeyString, amount) {
      const senderSecret = Uint8Array.from(
        Buffer.from(senderSecretHex, "hex")
      );
  
      const senderKeypair = Keypair.fromSecretKey(senderSecret);
      const receiverPublicKey = new PublicKey(receiverPublicKeyString);
  
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: receiverPublicKey,
          lamports: amount * LAMPORTS_PER_SOL
        })
      );
  
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [senderKeypair]
      );
  
      return signature;
    }
  }
  
  module.exports = new SolanaBlockchain();