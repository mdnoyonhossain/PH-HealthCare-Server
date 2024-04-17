import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces.ts/common";
import pick from "../../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const prescriptionData = req.body;
    const result = await PrescriptionService.insertIntoDB(user as TAuthUser, prescriptionData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Prescription Created Successfully!",
        data: result
    })
});

const patientPrescription = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PrescriptionService.patientPrescription(user as TAuthUser, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Prescription fatched Successfully!",
        meta: result.meta,
        data: result.data
    })
});

export const PrescriptionController = {
    insertIntoDB,
    patientPrescription
}