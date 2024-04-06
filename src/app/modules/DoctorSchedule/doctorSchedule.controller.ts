import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { Request, Response } from "express";

const insertIntoDB = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const doctorScheduleData = req.body;
    const result = await DoctorScheduleService.insertIntoDB(user, doctorScheduleData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Schedule Created Successfully!",
        data: result
    })
});

export const DoctorScheduleController = {
    insertIntoDB
}