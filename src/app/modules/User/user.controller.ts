import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
    try {
        const adminData = req.body;
        const result = await UserService.createAdmin(adminData);
        res.status(200).json({
            success: true,
            message: "Admin Created Successfully!",
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

export const UserController = {
    createAdmin
}