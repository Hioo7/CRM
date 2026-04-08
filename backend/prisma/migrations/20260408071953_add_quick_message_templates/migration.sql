-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('WHATSAPP', 'INSTAGRAM', 'LINKEDIN', 'X', 'FACEBOOK', 'SMS');

-- CreateTable
CREATE TABLE "QuickMessageTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "QuickMessageTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuickMessageTemplate" ADD CONSTRAINT "QuickMessageTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
