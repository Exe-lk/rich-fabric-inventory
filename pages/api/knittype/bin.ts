// pages/api/knittype/bin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createKnitType, getDeletedKnitTypes, updateKnitType, deleteKnitType } from '../../../service/knitTypeService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Values are required' });
          return;
        }
        const id = await createKnitType(values);
        res.status(201).json({ message: 'Knit Type created', id });
        break;
      }

      case 'GET': {
        const knitTypes = await getDeletedKnitTypes();
        res.status(200).json(knitTypes);
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Knit Type data is required' });
          return;
        }
        await updateKnitType(values.id, values);
        res.status(200).json({ message: 'Knit Type updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Knit Type ID is required' });
          return;
        }
        await deleteKnitType(id);
        res.status(200).json({ message: 'Knit Type deleted' });
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
