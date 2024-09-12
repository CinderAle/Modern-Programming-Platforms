import { ROUTES } from '@/constants/routes';
import { Router } from 'express';
import TrashcanController from '@/controller/trashcan';

const router = Router();

router.post(ROUTES.TRASHCAN, TrashcanController.create);
router.get(`${ROUTES.TRASHCAN}/:id`, TrashcanController.get);
router.put(ROUTES.TRASHCAN, TrashcanController.update);
router.delete(`${ROUTES.TRASHCAN}/:id`, TrashcanController.delete);

// For testing purposes
router.get(ROUTES.TRASHCAN, TrashcanController.getAll);

export default router;
