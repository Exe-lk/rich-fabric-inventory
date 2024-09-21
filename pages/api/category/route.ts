// pages/api/category.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../../../service/categoryService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { categoryname,subcategory } = req.body;
        if (!categoryname) {
          res.status(400).json({ error: 'Category name is required' });
          return;
        }
        const id = await createCategory(categoryname,subcategory);
        res.status(201).json({ message: 'Category created', id });
        break;
      }

      case 'GET': {
        const categories = await getCategories();
        res.status(200).json(categories);
        break;
      }

      case 'PUT': {
        const { id, name,status,subcategory } = req.body;
        if (!id || !name) {
          res.status(400).json({ error: 'Category ID and name are required' });
          return;
        }
        await updateCategory(id, name,subcategory,status);
        res.status(200).json({ message: 'Category updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Category ID is required' });
          return;
        }
        await deleteCategory(id);
        res.status(200).json({ message: 'Category deleted' });
        break;
      }

      default: {
        res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred',});
  }
}
