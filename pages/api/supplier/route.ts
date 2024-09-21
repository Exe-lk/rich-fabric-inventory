// pages/api/supplier/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} from '../../../service/supplierService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Supplier name and contact are required' });
          return;
        }
        const id = await createSupplier(values);
        res.status(201).json({ message: 'Supplier created', id });
        break;
      }

      case 'GET': {
        const suppliers = await getSuppliers();
        res.status(200).json(suppliers);
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Supplier ID, name, and contact are required' });
          return;
        }
        await updateSupplier(values.id,values);
        res.status(200).json({ message: 'Supplier updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Supplier ID is required' });
          return;
        }
        await deleteSupplier(id);
        res.status(200).json({ message: 'Supplier deleted' });
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
