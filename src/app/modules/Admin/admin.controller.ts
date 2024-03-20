import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = pick(req.query, adminFilterableFields);
        const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
        const result = await AdminService.getAllFromDB(filters, options);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin Data Retrived!",
            meta: result.meta,
            data: result.data
        });
    }
    catch (err: any) {
        next(err);
    }
}

const getByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await AdminService.getByIdFromDB(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin Data Retrived by Id!",
            data: result
        });
    }
    catch (err: any) {
        next(err);
    }
}

const updateIntoDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const adminData = req.body;
        console.log(req.body);
        const result = await AdminService.updateIntoDB(id, adminData);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Admin Updated Successfully!',
            data: result
        });
    }
    catch (err: any) {
        next(err);
    }
}

const deleteFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await AdminService.deleteFromDB(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Admin Deleted Successfully!',
            data: result
        });
    }
    catch (err: any) {
        next(err);
    }
}

const softDeleteFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await AdminService.softDeleteFromDB(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Admin Deleted Successfully!',
            data: result
        });
    }
    catch (err: any) {
        next(err);
    }
}

export const AdminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}