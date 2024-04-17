import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces.ts/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces.ts/pagination";
import { paginationHalper } from "../../../helpars/paginationHelpar";

const insertIntoDB = async (user: TAuthUser, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    });

    if (!(user?.email === appointmentData.doctor.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'this is not your appointment!');
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null || undefined
        },
        include: {
            patient: true
        }
    });

    return result
}

const patientPrescription = async (user: TAuthUser, options: TPaginationOptions) => {
    const { limit, page, skip } = paginationHalper.calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user?.email
            }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    });

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user?.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

export const PrescriptionService = {
    insertIntoDB,
    patientPrescription
}