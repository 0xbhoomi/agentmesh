import { Keypair } from '@stellar/stellar-sdk';
import { WalletManager } from './wallet-manager';

export interface CallRequest {
  service: string;
  intent?: string;
  params?: any;
  max_price_usdc?: string;
  priority: 'cheap' | 'fast' | 'balanced';
  agent_id: string;
}

export interface Provider {
  id: number;
  name: string;
  price: string;
  speed: number;
  trust: number;
  type: 'x402' | 'MPP';
  endpoint: string;
}

export class Orchestrator {
  private walletManager: WalletManager;

  constructor() {
    this.walletManager = new WalletManager();
  }

  async executePaidCall(request: CallRequest) {
    console.log(`[Orchestrator] Processing ${request.priority} call for ${request.service}`);
    
    // 1. Registry Lookup (Mocked for now, will use Soroban bindings)
    const providers = await this.lookupProviders(request.service);
    
    if (providers.length === 0) {
        throw { status: 404, message: `No providers found for service: ${request.service}` };
    }

    // 2. Intelligence: Pick best provider based on priority
    const provider = this.selectBestProvider(providers, request.priority);
    console.log(`[Orchestrator] Selected provider: ${provider.name} (${provider.type})`);

    // 3. Wallet Prep
    const agentWallet = await this.walletManager.getOrCreateAgentWallet(request.agent_id);
    
    // 4. Routing logic: x402 vs MPP
    try {
        let result;
        if (provider.type === 'MPP' && request.priority !== 'fast') {
            result = await this.handleMPPCall(provider, request, agentWallet);
        } else {
            result = await this.handleX402Call(provider, request, agentWallet);
        }

        // 5. Post-call Intelligence: Record success (simulated)
        this.recordCallResult(provider.id, true);

        return result;
    } catch (error: any) {
        console.warn(`[Orchestrator] Provider ${provider.name} failed. Retrying with next best...`);
        this.recordCallResult(provider.id, false);
        
        // Simple Failover: try the other one
        const fallbackProvider = providers.find(p => p.id !== provider.id);
        if (fallbackProvider) {
            return this.handleX402Call(fallbackProvider, request, agentWallet);
        }
        throw error;
    }
  }

  private async lookupProviders(category: string): Promise<Provider[]> {
    // In final version, this calls the Bazaar Soroban contract
    return [
      { id: 1, name: 'Search-A', price: '0.005', speed: 80, trust: 95, type: 'MPP', endpoint: 'http://search-a/api' },
      { id: 2, name: 'Search-B', price: '0.02', speed: 95, trust: 99, type: 'x402', endpoint: 'http://search-b/api' }
    ];
  }

  private selectBestProvider(providers: Provider[], priority: string): Provider {
     if (priority === 'cheap') return providers.reduce((prev, curr) => parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr);
     if (priority === 'fast') return providers.reduce((prev, curr) => prev.speed > curr.speed ? prev : curr);
     
     // Balanced: Sort by trust * speed / price
     return providers[0]; 
  }

  private async handleX402Call(provider: Provider, request: CallRequest, wallet: Keypair) {
    console.log(`[x402] Initiating payment for ${provider.name}...`);
    // This is where x402-stellar would wrap the fetch
    // For demo/sim, we return the structured response
    return {
      service_response: { 
        results: [`Found latest news for "${request.intent}" via ${provider.name}`],
        data: request.params
      },
      receipt: { 
        tx_hash: '0x' + Math.random().toString(16).slice(2, 10) + '...', 
        amount: provider.price, 
        asset: 'USDC' 
      },
      meta: { 
        provider: provider.name, 
        type: 'x402', 
        latency: `${Math.floor(Math.random() * 200 + 300)}ms`,
        cost_usdc: provider.price
      }
    };
  }

  private async handleMPPCall(provider: Provider, request: CallRequest, wallet: Keypair) {
     console.log(`[MPP] Opening high-frequency session with ${provider.name}...`);
     return {
      service_response: { 
        results: [`Semantic search results for "${request.intent}"`],
        provider_note: "Session active for 24h"
      },
      receipt: { 
        session_id: 'mpp_sess_' + Math.floor(Math.random() * 1000), 
        total_spent: provider.price, 
        asset: 'USDC' 
      },
      meta: { 
        provider: provider.name, 
        type: 'MPP', 
        savings: '40%', 
        latency: `${Math.floor(Math.random() * 400 + 600)}ms`,
        cost_usdc: provider.price
      }
    };
  }

  private recordCallResult(providerId: number, success: boolean) {
    console.log(`[Economic Engine] Recording ${success ? 'SUCCESS' : 'FAILURE'} for provider ${providerId}`);
    // Will update on-chain reputation in final version
  }

  async listService(data: any) {
    console.log(`[Bazaar] Listing new agent work service: ${data.name}`);
    return { 
      success: true, 
      service_id: Math.floor(Math.random() * 1000),
      on_chain_tx: '0x...'
    };
  }
}
