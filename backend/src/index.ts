import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import payRouter from './routes/pay';
import { WalletManager } from './services/wallet-manager';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/agentmesh', payRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'live', network: 'Stellar Testnet' });
});

const walletManager = new WalletManager();
walletManager.initializeSponsor().then(() => {
    app.listen(port, () => {
        console.log(`AgentMesh Payments Brain running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to initialize WalletManager:', err);
    process.exit(1);
});
