import { Patient, Prisma, UserStatus } from "@prisma/client";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import { TPaginationOptions } from "../../interfaces/pagination";
import { PatientSearchableFields } from "./patient.constant";
import { TPatientFilterRequest } from "./patient.interface";
import prisma from "../../../shared/prisma";

const getAllPatientFromDB = async (params: TPatientFilterRequest, options: TPaginationOptions) => {
    const { limit, page, skip } = PaginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: PatientSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.PatientWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
        include: {
            medicalReport: true,
            patientHealthData: true,
        }
    });

    const total = await prisma.patient.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
}

const getByIdPatientFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            medicalReport: true,
            patientHealthData: true,
        },
    });

    return result;
}

const updatePatientIntoDB = async (id: string, payload: any): Promise<Patient | null> => {
    const { patientHealthData, medicalReport, ...patientData } = payload;

    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.patient.update({
            where: {
                id
            },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReport: true
            }
        });

        if (patientHealthData) {
            await transactionClient.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id
                },
                update: patientHealthData,
                create: { ...patientHealthData, patientId: patientInfo.id }
            });
        }

        if (medicalReport) {
            await transactionClient.medicalReport.create({
                data: { ...medicalReport, patientId: patientInfo.id }
            });
        }
    });

    const responseData = await prisma.patient.findUniqueOrThrow({
        where: {
            id: patientInfo.id
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    })

    return responseData;
}

const deletePatientFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.patientHealthData.delete({
            where: {
                patientId: id
            }
        });

        await transactionClient.medicalReport.deleteMany({
            where: {
                patientId: id
            }
        });

        const deletedPatient = await transactionClient.patient.delete({
            where: {
                id
            }
        });

        await transactionClient.user.delete({
            where: {
                email: deletedPatient.email
            }
        });

        return deletedPatient;
    });

    return result;
}

const softDeletePatientFromDB = async (id: string): Promise<Patient | null> => {
    return await prisma.$transaction(async transactionClient => {
        const deletedPatient = await transactionClient.patient.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deletedPatient.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deletedPatient;
    });
}

export const PatientService = {
    getAllPatientFromDB,
    getByIdPatientFromDB,
    updatePatientIntoDB,
    deletePatientFromDB,
    softDeletePatientFromDB
}