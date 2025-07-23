import { Router } from 'express';
import { evaluatePrompt, fetchLeads } from '../controllers/leadController';


const leadRoutes = Router();

leadRoutes.post('/evaluate', evaluatePrompt);
leadRoutes.get('/leads', fetchLeads);
export default leadRoutes;