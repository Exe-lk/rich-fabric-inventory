// pages/api/gsm/bin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createGsm, getDeletedGsms, updateGsm, deleteGsm } from '../../../service/gsmService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Values are required' });
          return;
        }
        const id = await createGsm(values);
        res.status(201).json({ message: 'GSM created', id });
        break;
      }

      case 'GET': {
        const gsms = await getDeletedGsms();
        res.status(200).json(gsms);
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'GSM data is required' });
          return;
        }
        await updateGsm(values.id, values);
        res.status(200).json({ message: 'GSM updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'GSM ID is required' });
          return;
        }
        await deleteGsm(id);
        res.status(200).json({ message: 'GSM deleted' });
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
