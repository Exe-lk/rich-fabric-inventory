// pages/api/lotMovement/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getLotMovementById, updateLotMovement, deleteLotMovement } from '../../../service/lotMovementService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Lot Movement ID is required' });
    return;
  }

  try {
    switch (req.method) {
      case 'GET': {
        const lotMovement = await getLotMovementById(id as string);
        if (!lotMovement) {
          res.status(404).json({ error: 'Lot Movement not found' });
        } else {
          res.status(200).json(lotMovement);
        }
        break;
      }

      case 'PUT': {
        const { lotId, status, movementDate } = req.body;
        if (!lotId || !status || !movementDate) {
          res.status(400).json({ error: 'Required fields are missing' });
          return;
        }
        await updateLotMovement(id as string, { lotId, status, movementDate });
        res.status(200).json({ message: 'Lot Movement updated' });
        break;
      }

      case 'DELETE': {
        await deleteLotMovement(id as string);
        res.status(200).json({ message: 'Lot Movement deleted' });
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
