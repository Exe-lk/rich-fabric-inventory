// pages/api/lot/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getLotById, updateLot, deleteLot } from '../../../service/stockOutService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Lot ID is required' });
    return;
  }

  try {
    switch (req.method) {
      case 'GET': {
        const lot = await getLotById(id as string);
        if (!lot) {
          res.status(404).json({ error: 'Lot not found' });
        } else {
          res.status(200).json(lot);
        }
        break;
      }

      case 'PUT': {
        const values  = req.body;
        if (!values) {
          res.status(400).json({ error: 'Lot number is required' });
          return;
        }
        await updateLot(values.id as string,values as any);
        res.status(200).json({ message: 'Lot updated' });
        break;
      }

      case 'DELETE': {
        await deleteLot(id as string);
        res.status(200).json({ message: 'Lot deleted' });
        break;
      }

      default: {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}
