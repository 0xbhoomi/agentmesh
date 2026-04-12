import { 
  Keypair, 
  Networks, 
  Address, 
  rpc, 
  Asset, 
  Operation, 
  TransactionBuilder, 
  BASE_FEE,
  Transaction
} from '@stellar/stellar-sdk';

export class WalletManager {
  private server: rpc.Server;
  private networkPassphrase: string;
  private sponsorKeypair: Keypair;
  private usdcAsset: Asset;

  constructor() {
    this.server = new rpc.Server(process.env.RPC_URL || 'https://soroban-testnet.stellar.org');
    this.networkPassphrase = process.env.NETWORK_PASSPHRASE || Networks.TESTNET;
    
    const secret = process.env.SPONSOR_SECRET;
    if (secret && secret.startsWith('S') && secret.length === 56) {
      this.sponsorKeypair = Keypair.fromSecret(secret);
    } else {
      console.warn('[WalletManager] No valid SPONSOR_SECRET found. Using ephemeral key for demo.');
      this.sponsorKeypair = Keypair.random();
    }

    this.usdcAsset = new Asset(
        process.env.USDC_ASSET_CODE || 'USDC',
        process.env.USDC_ISSUER || 'GDVZXFYPNNRJAQBND2HZJ6AIYGBBHJCGOW426NHWHU4JPFURE3IAPH5E'
    );
  }

  async initializeSponsor() {
    try {
        const account = await this.server.getAccount(this.sponsorKeypair.publicKey());
        console.log(`[WalletManager] Sponsor ${this.sponsorKeypair.publicKey()} is active.`);
        return account;
    } catch (e) {
        console.log(`[WalletManager] Sponsor not found. Funding via Friendbot...`);
        const response = await fetch(`https://friendbot.stellar.org/?addr=${this.sponsorKeypair.publicKey()}`);
        if (response.ok) {
            console.log(`[WalletManager] Sponsor funded successfully.`);
            return await this.server.getAccount(this.sponsorKeypair.publicKey());
        }
        throw new Error('Failed to fund sponsor wallet.');
    }
  }

  async getOrCreateAgentWallet(agentId: string) {
    // Deterministic key derivation for the demo (simplification of BIP44)
    // In a real app, use a proper vault.
    const seed = Buffer.alloc(32);
    Buffer.from(`agentmesh-seed-${agentId}`).copy(seed);
    const agentKeypair = Keypair.fromRawEd25519Seed(seed);
    
    console.log(`[WalletManager] Agent ${agentId} wallet: ${agentKeypair.publicKey()}`);
    
    // Ensure the agent account exists and has trustlines
    await this.ensureAgentReady(agentKeypair);
    
    return agentKeypair;
  }

  private async getAccountWithRetry(publicKey: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            return await this.server.getAccount(publicKey);
        } catch (e) {
            if (i === retries - 1) throw e;
            console.log(`[WalletManager] Account ${publicKey} not found. Retrying in ${1000 * (i + 1)}ms...`);
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
  }

  private async ensureAgentReady(agentKeypair: Keypair) {
    try {
        const account = await this.getAccountWithRetry(agentKeypair.publicKey(), 1); // Quick check first
        const hasUSDC = account.balances.some(b => 
            'asset_code' in b && b.asset_code === this.usdcAsset.code && b.asset_issuer === this.usdcAsset.issuer
        );

        if (!hasUSDC) {
            console.log(`[WalletManager] Adding USDC trustline for agent...`);
            await this.changeTrust(agentKeypair);
        }
    } catch (e) {
        console.log(`[WalletManager] Creating and funding new agent account...`);
        await this.createAndFundAgent(agentKeypair);
    }
  }

  private async createAndFundAgent(agentKeypair: Keypair) {
    const sponsorAccount = await this.server.getAccount(this.sponsorKeypair.publicKey());
    
    const tx = new TransactionBuilder(sponsorAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
    })
    .addOperation(Operation.createAccount({
        destination: agentKeypair.publicKey(),
        startingBalance: '10' // 10 XLM for reserves
    }))
    .setTimeout(30)
    .build();

    tx.sign(this.sponsorKeypair);
    const result = await this.server.sendTransaction(tx);
    console.log(`[WalletManager] Agent account created: ${result.hash}`);

    // Add trustline
    await this.changeTrust(agentKeypair);
  }

  private async changeTrust(agentKeypair: Keypair) {
    const agentAccount = await this.getAccountWithRetry(agentKeypair.publicKey());
    const tx = new TransactionBuilder(agentAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
    })
    .addOperation(Operation.changeTrust({
        asset: this.usdcAsset,
        limit: '1000'
    }))
    .setTimeout(30)
    .build();

    tx.sign(agentKeypair);
    await this.server.sendTransaction(tx);
    console.log(`[WalletManager] USDC trustline established.`);
  }

  async fundAgentWithUSDC(agentPublicKey: string, amount: string) {
    const sponsorAccount = await this.getAccountWithRetry(this.sponsorKeypair.publicKey());
    
    const tx = new TransactionBuilder(sponsorAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
    })
    .addOperation(Operation.payment({
        destination: agentPublicKey,
        asset: this.usdcAsset,
        amount: amount
    }))
    .setTimeout(30)
    .build();

    tx.sign(this.sponsorKeypair);
    const result = await this.server.sendTransaction(tx);
    console.log(`[WalletManager] Funded agent with ${amount} USDC: ${result.hash}`);
    return result.hash;
  }
}
