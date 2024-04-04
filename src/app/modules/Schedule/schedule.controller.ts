import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const insertIntoDB = catchAsync(async (req, res) => {
    const scheduleData = req.body;
    const result = await ScheduleService.insertIntoDB(scheduleData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule Create Successfully!",
        data: result
    });
});

export const ScheduleController = {
    insertIntoDB
}