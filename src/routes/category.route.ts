import { Router } from 'express';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/category.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllCategories); 
router.post('/', verifyToken, verifyAdmin, createCategory); 
router.delete('/:id', verifyToken, verifyAdmin, deleteCategory); 

export default router;