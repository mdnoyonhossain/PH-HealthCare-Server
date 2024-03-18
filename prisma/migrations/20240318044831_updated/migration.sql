-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "needPasswordChange" SET DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
