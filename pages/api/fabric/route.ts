// pages/api/fabric/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createFabric, getFabrics, updateFabric, deleteFabric } from '../../../service/fabricService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Values are required' });
          return;
        }
        const id = await createFabric(values);
        res.status(201).json({ message: 'Fabric created', id });
        break;
      }

      case 'GET': {
        const fabrics = await getFabrics();
        res.status(200).json(fabrics);
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values.id) {
          res.status(400).json({ error: 'Fabric ID is required' });
          return;
        }
        await updateFabric(values.id, values);
        res.status(200).json({ message: 'Fabric updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Fabric ID is required' });
          return;
        }
        await deleteFabric(id);
        res.status(200).json({ message: 'Fabric deleted' });
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
