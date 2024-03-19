import { Admin, Prisma } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHalper } from "../../../helpars/paginationHelpar";
import prisma from "../../../shared/prisma";

const getAllFromDB = async (params: any, options: any) => {
    const { searchTerm, ...filterData } = params;
    const { limit, page, skip, sortBy, sortOrder } = paginationHalper.calculatePagination(options);
    const andCondions: Prisma.AdminWhereInput[] = [];

    // Searching
    if (params.searchTerm) {
        andCondions.push({
            OR: adminSearchAbleFields.map(field => ({
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
                    equals: filterData[key]
                }
            }))
        })
    }

    const whereCondions: Prisma.AdminWhereInput = { AND: andCondions };

    const result = await prisma.admin.findMany({
        where: whereCondions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.admin.count({
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

const getByIdFromDB = async (id: string) => {
    const result = await prisma.admin.findUnique({
        where: {
            id
        }
    });
    
    return result;
}

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
    const result = await prisma.admin.update({
        where: {
            id
        },
        data
    });

    return result;
}

export const AdminService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB
}