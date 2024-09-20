// pages/api/color/bin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createColor, getDeletedColors, updateColor, deleteColor } from '../../../service/colorService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Values are required' });
          return;
        }
        const id = await createColor(values);
        res.status(201).json({ message: 'Color created', id });
        break;
      }

      case 'GET': {
        const colors = await getDeletedColors();
        res.status(200).json(colors);
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Color data is required' });
          return;
        }
        await updateColor(values.id, values);
        res.status(200).json({ message: 'Color updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Color ID is required' });
          return;
        }
        await deleteColor(id);
        res.status(200).json({ message: 'Color deleted' });
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
