import { Patient, Prisma, UserStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { TPatientFilterRequest, TPatientUpdate } from './patient.interface';
import { patientSearchableFields } from './patient.constants';
import { paginationHalper } from '../../../helpars/paginationHelpar';
import { TPaginationOptions } from '../../interfaces.ts/pagination';

const getAllFromDB = async (filters: TPatientFilterRequest, options: TPaginationOptions) => {
    const { limit, page, skip } = paginationHalper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map(field => ({
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
        orderBy:
            options.sortBy && options.sortOrder
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
};

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUnique({
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
};

const updateIntoDB = async (id: string, payload: Partial<TPatientUpdate>): Promise<Patient | null> => {
    const { patientHealthData, medicalReport, ...patientData } = payload;

    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            id
        }
    });

    await prisma.$transaction(async (transactionClient) => {
        // Update Patient Data
        await transactionClient.patient.update({
            where: {
                id,
                isDeleted: false
            },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReport: true
            }
        });

        // Create OR Update Patient Health Data
        if (patientHealthData) {
            await transactionClient.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id
                },
                update: patientHealthData,
                create: {
                    ...patientHealthData,
                    patientId: patientInfo.id
                }
            });
        }

        if (medicalReport) {
            await transactionClient.medicalReport.create({
                data: { ...medicalReport, patientId: patientInfo.id }
            });
        }
    });

    const responseData = await prisma.patient.findUnique({
        where: {
            id: patientInfo.id
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });

    return responseData;
};


const deleteFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.$transaction(async (tx) => {
        // Delete Medical Report
        await tx.medicalReport.deleteMany({
            where: {
                patientId: id
            }
        });

        // Patient Health Data
        await tx.patientHealthData.delete({
            where: {
                patientId: id
            }
        });

        // Patient Delete
        const deletedPatient = await tx.patient.delete({
            where: {
                id
            }
        });

        // Patient User Delete
        await tx.user.delete({
            where: {
                email: deletedPatient.email
            }
        });

        return deletedPatient;
    });

    return result;
};

const softDelete = async (id: string): Promise<Patient | null> => {
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
};

export const PatientService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDelete,
};