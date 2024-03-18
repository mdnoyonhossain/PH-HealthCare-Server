import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {
    const andCondions: Prisma.AdminWhereInput[] = [];
    const adminSearchAbleFields = ['name', 'email'];

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

    const whereCondions: Prisma.AdminWhereInput = { AND: andCondions };

    const result = await prisma.admin.findMany({
        where: whereCondions
    });
    return result;
}

export const AdminService = {
    getAllFromDB
}