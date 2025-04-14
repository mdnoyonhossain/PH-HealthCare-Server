import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data));
        return UserController.createAdmin(req, res, next);
    }
);

export const UserRoutes = router;