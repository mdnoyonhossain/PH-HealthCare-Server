import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllFromDB = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, adminFilterableFields);
        const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
        const result = await AdminService.getAllFromDB(filters, options);

        res.status(200).json({
            success: true,
            message: "Admin Data Retrived!",
            meta: result.meta,
            data: result.data
        });
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.name || "Something went wrong!",
            error: err
        })
    }
}

const getByIdFromDB = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await AdminService.getByIdFromDB(id);

        res.status(200).json({
            success: true,
            message: "Admin Data Retrived by Id!",
            data: result
        });
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.name || "Something went wrong!",
            error: err
        })
    }
}

const updateIntoDB = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminData = req.body;
        console.log(req.body);
        const result = await AdminService.updateIntoDB(id, adminData);

        res.status(200).json({
            success: true,
            message: 'Admin Updated Successfully!',
            data: result
        })
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.name || "Something went wrong!",
            error: err
        })
    }
}

export const AdminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
}