// pages/api/knittype/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getKnitTypeById, updateKnitType, deleteKnitType } from '../../../service/knitTypeService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Knit Type ID is required' });
    return;
  }

  try {
    switch (req.method) {
      case 'GET': {
        const knitType = await getKnitTypeById(id as string);
        if (!knitType) {
          res.status(404).json({ error: 'Knit Type not found' });
        } else {
          res.status(200).json(knitType);
        }
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Knit Type data is required' });
          return;
        }
        await updateKnitType(id as string, values);
        res.status(200).json({ message: 'Knit Type updated' });
        break;
      }

      case 'DELETE': {
        await deleteKnitType(id as string);
        res.status(200).json({ message: 'Knit Type deleted' });
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
