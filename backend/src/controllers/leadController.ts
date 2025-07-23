import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { LeadScore } from '../util/prompt';

const prisma = new PrismaClient();

export async function evaluatePrompt(req: Request, res: Response) {
  const { name, email, capturedKeywords } = req.body;


  // Log the incoming request
  console.log('Received lead evaluation request:', { name, email, capturedKeywords });

  if (!name || !email || !capturedKeywords) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const { score, intent } = await LeadScore(capturedKeywords);
    console.log('Prompt responded with:', { score, intent });


    if (intent === 'High') {
      await prisma.lead.create({ 
      data: { 
        name, 
        email, 
        capturedKeywords: Array.isArray(capturedKeywords) ? capturedKeywords.join(', ') : String(capturedKeywords),
        score, 
        intent } });
      return res.json({ message: "Lead Created", score, intent });
    } else {
      return res.json({ message: "No Lead Generated", score, intent });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function fetchLeads(req: Request, res: Response) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (err: any) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: err.message });
  }
}