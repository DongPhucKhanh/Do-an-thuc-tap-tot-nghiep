import { Router } from 'express';
import { getAllFaculties, createFaculty, deleteFaculty } from '../controllers/faculty.controller';

const router = Router();

router.get('/', getAllFaculties);
router.post('/', createFaculty); 
router.delete('/:id', deleteFaculty);

export default router;