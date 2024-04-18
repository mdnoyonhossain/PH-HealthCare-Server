import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MetaService } from "./meta.service";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces.ts/common";

const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meta Data Retrival Successfully!",
        data: result
    })
});

export const MetaController = {
    fetchDashboardMetaData
}