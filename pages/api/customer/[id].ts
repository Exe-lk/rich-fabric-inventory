import type { NextApiRequest, NextApiResponse } from 'next';
import { getCustomerById, updateCustomer, deleteCustomer } from '../../../service/customerService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET': {
        const customer = await getCustomerById(id as string);
        if (!customer) {
          res.status(404).json({ message: 'Customer not found' });
          return;
        }
        res.status(200).json(customer);
        break;
      }
      case 'PUT': {
        const values = req.body;
        await updateCustomer(id as string, values);
        res.status(200).json({ message: 'Customer updated' });
        break;
      }
      case 'DELETE': {
        await deleteCustomer(id as string);
        res.status(200).json({ message: 'Customer deleted' });
        break;
      }
      default: {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
}
