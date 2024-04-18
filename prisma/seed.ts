import { UserRole } from "@prisma/client";
import prisma from "../src/shared/prisma";

const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                role: UserRole.SUPER_ADMIN
            }
        });

        if (isExistSuperAdmin) {
            console.log('Super Admin already exists!');
            return;
        }

        const superAdminData = await prisma.user.create({
            data: {
                email: "super@admin.com",
                password: "superadmin",
                role: UserRole.SUPER_ADMIN,
                admin: {
                    create: {
                        name: "Super Admin",
                        // email: "super@admin.com",
                        contactNumber: "01234567890"
                    }
                }
            }
        });

        console.log("Super Admin Created Successfully!", superAdminData);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await prisma.$disconnect();
    }
}

seedSuperAdmin();