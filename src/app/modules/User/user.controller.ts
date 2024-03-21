import { userService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const createAdmin = catchAsync(async (req, res) => {
    const result = await userService.createAdmin(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Created Successfully!",
        data: result
    });
})

export const userController = {
    createAdmin
}