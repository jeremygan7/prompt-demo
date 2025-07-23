import 'dotenv/config';
import express from 'express';
import leadRoutes from './routes/leadRoutes';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());
app.use(leadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});