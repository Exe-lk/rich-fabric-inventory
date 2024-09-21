// pages/api/color/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getColorById, updateColor, deleteColor } from '../../../service/colorService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Color ID is required' });
    return;
  }

  try {
    switch (req.method) {
      case 'GET': {
        const color = await getColorById(id as string);
        if (!color) {
          res.status(404).json({ error: 'Color not found' });
        } else {
          res.status(200).json(color);
        }
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Color data is required' });
          return;
        }
        await updateColor(id as string, values);
        res.status(200).json({ message: 'Color updated' });
        break;
      }

      case 'DELETE': {
        await deleteColor(id as string);
        res.status(200).json({ message: 'Color deleted' });
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
