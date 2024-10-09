// pages/api/lotMovement/bin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createLotMovement,
  getDeletedLotMovements,
  updateLotMovement,
  deleteLotMovement,
} from '../../../service/lotMovementService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { lotId, status, movementDate } = req.body;
        if (!lotId || !status || !movementDate) {
          res.status(400).json({ error: 'Lot ID, status, and movement date are required' });
          return;
        }
        const id = await createLotMovement({ lotId, status, movementDate });
        res.status(201).json({ message: 'Lot Movement created', id });
        break;
      }

      case 'GET': {
        const lotMovements = await getDeletedLotMovements();
        res.status(200).json(lotMovements);
        break;
      }

      case 'PUT': {
        const { id, lotId, status, movementDate } = req.body;
        if (!id || !lotId || !status || !movementDate) {
          res.status(400).json({ error: 'Lot Movement ID, lot ID, status, and movement date are required' });
          return;
        }
        await updateLotMovement(id, { lotId, status, movementDate });
        res.status(200).json({ message: 'Lot Movement updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Lot Movement ID is required' });
          return;
        }
        await deleteLotMovement(id);
        res.status(200).json({ message: 'Lot Movement deleted' });
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
