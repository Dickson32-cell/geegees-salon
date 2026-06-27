-- AlterTable
ALTER TABLE "services" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'draft';

-- Update existing services to 'published' status
UPDATE "services" SET "status" = 'published' WHERE "status" = 'draft';
