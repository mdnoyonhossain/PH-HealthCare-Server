import { Admin, Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import { fileUploader } from "../../../helpars/fileUploader";
import { TFile } from "../../interfaces.ts/file";
import { Request } from "express";
import { TPaginationOptions } from "../../interfaces.ts/pagination";
import { paginationHalper } from "../../../helpars/paginationHelpar";
import { userSearchAbleFields } from "./user.constant";

const createAdmin = async (req: Request): Promise<Admin> => {
    const file = req.file as TFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(config.salt_round));

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData
    });

    return result;
}

const createDoctor = async (req: Request): Promise<Doctor> => {
    const file = req.file as TFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(config.salt_round));

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData
    });

    return result;
}

const createPatient = async (req: Request): Promise<Patient> => {
    const file = req.file as TFile;

    if (file) {
        const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(config.salt_round));

    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        });

        return createdPatientData;
    });

    return result;
};

const getAllFromDB = async (params: any, options: TPaginationOptions) => {
    console.log({ params, options });
    const { searchTerm, ...filterData } = params;
    const { limit, page, skip } = paginationHalper.calculatePagination(options);
    const andCondions: Prisma.UserWhereInput[] = [];

    // Searching
    if (params.searchTerm) {
        andCondions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    // Filtering
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereCondions: Prisma.UserWhereInput = andCondions.length > 0 ? { AND: andCondions } : {};

    const result = await prisma.user.findMany({
        where: whereCondions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            patient: true,
            doctor: true
        }
    });

    const total = await prisma.user.count({
        where: whereCondions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

const changeProfileStatus = async (id: string, status: UserRole) => {
   await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
}

export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus
}