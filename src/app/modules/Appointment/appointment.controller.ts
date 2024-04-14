import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces.ts/common";
import pick from "../../../shared/pick";
import { appointmentFilterableFields } from "./appointment.constant";

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

const getMyAppointment = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ['status', 'paymentStatus']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AppointmentService.getMyAppointment(user as TAuthUser, filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Appointment Retrived Successfully",
        data: result
    })
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, appointmentFilterableFields)
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AppointmentService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllFromDB
}