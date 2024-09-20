import type { NextApiRequest, NextApiResponse } from 'next';
import { createCustomer, getDeletedCustomer, updateCustomer, deleteCustomer } from '../../../service/customerService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Values are required' });
          return;
        }
        const id = await createCustomer(values);
        res.status(201).json({ message: 'Customer created', id });
        break;
      }

      case 'GET': {
        const customers = await getDeletedCustomer();
        res.status(200).json(customers);
        break;
      }

      case 'PUT': {
        const values = req.body;
        if (!values) {
          res.status(400).json({ error: 'Customer data is required' });
          return;
        }
        await updateCustomer(values.id, values);
        res.status(200).json({ message: 'Customer updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Customer ID is required' });
          return;
        }
        await deleteCustomer(id);
        res.status(200).json({ message: 'Customer deleted' });
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
