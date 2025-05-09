import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
    const { appointmentId } = req.params;
    const result = await PaymentService.initPayment(appointmentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment initialized successfully.",
        data: result
    });
});

const validatePayment = catchAsync(async (req, res) => {
    const ipnQuery = req.query;
    const result = await PaymentService.validatePayment(ipnQuery);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment Validate successfully.",
        data: result
    });
});

export const PaymentController = {
    initPayment,
    validatePayment
}