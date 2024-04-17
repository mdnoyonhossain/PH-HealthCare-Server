import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces.ts/common";

const insertIntoDB = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const reviewData = req.body;
    const result = await ReviewService.insertIntoDB(user as TAuthUser, reviewData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review Created Successfully!",
        data: result
    })
});

export const ReviewController = {
    insertIntoDB
}