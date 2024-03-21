import express from 'express';
import { AdminController } from './admin.controller';
import { adminValidationSchemas } from './admin.validations';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', AdminController.getAllFromDB);

router.get('/:id', AdminController.getByIdFromDB);

router.patch(
    '/:id',
    validateRequest(adminValidationSchemas.update),
    AdminController.updateIntoDB
);

router.delete('/:id', AdminController.deleteFromDB);

router.delete('/soft/:id', AdminController.softDeleteFromDB);

export const AdminRoutes = router;