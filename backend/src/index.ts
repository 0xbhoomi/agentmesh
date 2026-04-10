import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import payRouter from './routes/pay';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/agentmesh', payRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'live', network: 'Stellar Testnet' });
});

app.listen(port, () => {
  console.log(`AgentMesh Payments Brain running on http://localhost:${port}`);
});
