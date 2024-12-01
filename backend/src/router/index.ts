import { ROUTES } from '@/constants/routes';
import { Router } from 'express';
import TrashcanController from '@/controller/trashcan';
import AuthController from '@/controller/auth';

const router = Router();

router.post(ROUTES.TRASHCAN, TrashcanController.create);
router.get(`${ROUTES.TRASHCAN}/:id`, TrashcanController.get);
router.get(ROUTES.TRASHCAN, TrashcanController.getByFilters);
router.put(ROUTES.TRASHCAN, TrashcanController.update);
router.delete(`${ROUTES.TRASHCAN}/:id`, TrashcanController.delete);
router.get(`${ROUTES.TRASHCAN}/delete/:id`, TrashcanController.delete);
router.post(`${ROUTES.AUTH}/signup`, AuthController.create);
router.post(`${ROUTES.AUTH}`, AuthController.get);
router.put(`${ROUTES.AUTH}`, AuthController.update);

export default router;
