// pages/api/lot/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createLot, getLots, updateLot, deleteLot } from '../../../service/stockOutService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const values = req.body;
       console.log(values)
        if (!values) {
          res.status(400).json({ error: 'Lot number is required' });
          return;
        }
        const id = await createLot(values);
        res.status(201).json({ message: 'Lot created', id });
        break;
      }

      case 'GET': {
        const lots = await getLots();
        res.status(200).json(lots);
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (values) {
          res.status(400).json({ error: 'Lot ID and number are required' });
          return;
        }
        await updateLot(values.id, values);
        res.status(200).json({ message: 'Lot updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Lot ID is required' });
          return;
        }
        await deleteLot(id);
        res.status(200).json({ message: 'Lot deleted' });
        break;
      }

      default: {
        res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}
