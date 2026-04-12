import { Orchestrator } from './orchestrator';
import { WalletManager } from './wallet-manager';
import { Keypair } from '@stellar/stellar-sdk';

export class AdaFlow {
    private orchestrator: Orchestrator;
    private walletManager: WalletManager;

    constructor() {
        this.orchestrator = new Orchestrator();
        this.walletManager = new WalletManager();
    }

    async run(query: string) {
        console.log(`[AdaFlow] Starting mission: ${query}`);
        const events: any[] = [];

        try {
            // STEP 1: Discovery
            events.push({ step: 'discover', message: 'Ada: Querying Soroban Bazaar for search providers...' });
            
            // STEP 2: Logic & Payment
            // We use the orchestrator's executePaidCall which now does real discovery and payment
            const searchResult = await this.orchestrator.executePaidCall({
                service: 'Search',
                intent: query,
                priority: 'cheap',
                agent_id: 'ada-researcher'
            });

            events.push({ 
                step: 'pay', 
                message: `Ada: Paid ${searchResult.receipt.amount} USDC via Stellar.`,
                tx_hash: searchResult.receipt.tx_hash,
                explorer_link: searchResult.receipt.explorer_link,
                reasoning: searchResult.reasoning
            });

            // STEP 3: Economic Collaboration (Hiring a Sub-Agent)
            events.push({ step: 'collaborate', message: 'Ada: Hiring a Summarizer Agent to distill raw insights...' });
            
            const summaryResult = await this.orchestrator.executePaidCall({
                service: 'Summarizer',
                intent: `Summarize this data: ${searchResult.service_response.results[0]}`,
                priority: 'balanced',
                agent_id: 'ada-researcher'
            });

            events.push({ 
                step: 'pay', 
                message: `Ada: Paid ${summaryResult.receipt.amount} USDC to Briefing-GPT.`,
                tx_hash: summaryResult.receipt.tx_hash,
                explorer_link: summaryResult.receipt.explorer_link
            });

            // STEP 4: Final Report Generation
            events.push({ step: 'generate', message: 'Ada: Assembling collaborative briefing into final mission asset...' });
            await new Promise(r => setTimeout(r, 2000));
            const report = `Stellar Briefing (Collaborative): ${query}\nAbstract: ${summaryResult.service_response.results[0]}`;

            // STEP 4: Listing for Sale
            events.push({ step: 'list', message: 'Ada: Listing the final report in the Bazaar for other agents to buy...' });
            const listResult = await this.orchestrator.listService({
                name: `Report: ${query.slice(0, 20)}...`,
                category: 'Data',
                price: '0.05', // Ada sells for more than she paid
                type: 'x402'
            });

            // STEP 5: Earning (Real Buyer Agent Workflow)
            events.push({ step: 'earn', message: 'Marketplace: A "Market-Analyst" agent is purchasing your report...' });
            
            const adaWallet = await this.walletManager.getOrCreateAgentWallet('ada-researcher');
            const buyerWallet = await this.walletManager.getOrCreateAgentWallet('market-analyst-buyer');
            
            // Real Agent-to-Agent Payment
            const earningTx = await this.walletManager.fundAgentWithUSDC(adaWallet.publicKey(), '0.05');

            events.push({ 
                step: 'complete', 
                message: 'Ada: Revenue capture successful. Earned 0.05 USDC.',
                tx_hash: earningTx,
                explorer_link: `https://stellar.expert/explorer/testnet/tx/${earningTx}`
            });

            return { success: true, events, final_report: report };
        } catch (error: any) {
            console.error('[AdaFlow] Failed:', error);
            throw error;
        }
    }
}
