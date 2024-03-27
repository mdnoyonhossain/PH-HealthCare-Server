import { userService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterAbleFields } from "./user.constant";

const createAdmin = catchAsync(async (req, res) => {
    const result = await userService.createAdmin(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Created Successfully!",
        data: result
    });
});

const createDoctor = catchAsync(async (req, res) => {
    const result = await userService.createDoctor(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Created Successfully!",
        data: result
    });
});

const createPatient = catchAsync(async (req, res) => {
    const result = await userService.createPatient(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Created Successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, userFilterAbleFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await userService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users Data Retrived!",
        meta: result.meta,
        data: result.data
    });
});

const changeProfileStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userStatus = req.body;
    const result = await userService.changeProfileStatus(id, userStatus);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Profile Status Changed!",
        data: result
    });
});

export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus
}