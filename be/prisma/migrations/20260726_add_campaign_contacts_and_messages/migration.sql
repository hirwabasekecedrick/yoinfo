-- AlterTable: Add new columns to Campaign table
ALTER TABLE "Campaign" ADD COLUMN "emailSubject" TEXT,
ADD COLUMN "emailMessage" TEXT,
ADD COLUMN "smsMessage" TEXT,
ADD COLUMN "whatsappMessage" TEXT,
ADD COLUMN "contacts" JSONB;
