import { Router } from 'express';
import { Orchestrator } from '../services/orchestrator';
import { AdaFlow } from '../services/ada-flow';

const router = Router();
const orchestrator = new Orchestrator();
const adaFlow = new AdaFlow();

// Trigger the "Ada" Killer Flow
router.post('/run', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    console.log(`[AgentMesh] Triggering Ada Research Flow for: ${query}`);
    const result = await adaFlow.run(query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Unified Paid Call API
router.post('/pay', async (req, res) => {
  try {
    const { service, intent, params, max_price_usdc, priority, agent_id } = req.body;
    
    if (!service || !agent_id) {
      return res.status(400).json({ error: 'Missing service or agent_id' });
    }

    console.log(`[AgentMesh] Intelligence Layer processing request from ${agent_id} for ${service}...`);
    
    const result = await orchestrator.executePaidCall({
      service,
      intent,
      params,
      max_price_usdc,
      priority: priority || 'balanced',
      agent_id
    });

    res.json(result);
  } catch (error: any) {
    console.error('[AgentMesh] Paid Call Failed:', error.message);
    res.status(error.status || 500).json({ 
      error: error.message,
      receipt: error.receipt || null
    });
  }
});

// Agent-to-Agent Earning Loop: List work as a service
router.post('/list', async (req, res) => {
  try {
    const { provider_id, category, name, price, type, endpoint } = req.body;
    
    const result = await orchestrator.listService({
      provider_id,
      category,
      name,
      price,
      type,
      endpoint
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
