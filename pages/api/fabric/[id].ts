// pages/api/fabric/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFabricById, updateFabric, deleteFabric } from '../../../service/fabricService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Fabric ID is required' });
    return;
  }

  try {
    switch (req.method) {
      case 'GET': {
        const fabric = await getFabricById(id as string);
        if (!fabric) {
          res.status(404).json({ error: 'Fabric not found' });
        } else {
          res.status(200).json(fabric);
        }
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Fabric data is required' });
          return;
        }
        await updateFabric(id as string, values);
        res.status(200).json({ message: 'Fabric updated' });
        break;
      }

      case 'DELETE': {
        await deleteFabric(id as string);
        res.status(200).json({ message: 'Fabric deleted' });
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
