// pages/api/gsm/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getGsmById, updateGsm, deleteGsm } from '../../../service/gsmService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'GSM ID is required' });
    return;
  }

  try {
    switch (req.method) {
      case 'GET': {
        const gsm = await getGsmById(id as string);
        if (!gsm) {
          res.status(404).json({ error: 'GSM not found' });
        } else {
          res.status(200).json(gsm);
        }
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'GSM data is required' });
          return;
        }
        await updateGsm(id as string, values);
        res.status(200).json({ message: 'GSM updated' });
        break;
      }

      case 'DELETE': {
        await deleteGsm(id as string);
        res.status(200).json({ message: 'GSM deleted' });
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
