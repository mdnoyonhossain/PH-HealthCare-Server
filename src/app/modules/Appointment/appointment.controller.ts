import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces.ts/common";

const createAppointment = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const appointmentData = req.body;
    const result = await AppointmentService.createAppointment(user as TAuthUser, appointmentData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Appointment Booked Successfully!",
        data: result
    })
});

export const AppointmentController = {
    createAppointment
}