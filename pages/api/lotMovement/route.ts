// pages/api/lotMovement/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createLotMovement, getLotMovements, updateLotMovement, deleteLotMovement } from '../../../service/lotMovementService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const values= req.body;
        // if (!lotId || !status || !movementDate) {
          // res.status(400).json({ error: 'Required fields are missing' });
          // return;
        // }
        const id = await createLotMovement(values);
        res.status(201).json({ message: 'Lot Movement created', id });
        break;
      }

      case 'GET': {
        const lotMovements = await getLotMovements();
        res.status(200).json(lotMovements);
        break;
      }

      case 'PUT': {
        const { id, lotId, status, movementDate } = req.body;
        if (!id || !lotId || !status || !movementDate) {
          res.status(400).json({ error: 'Required fields are missing' });
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
