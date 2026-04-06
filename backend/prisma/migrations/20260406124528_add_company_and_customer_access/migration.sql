-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('READ_ONLY', 'READ_WRITE');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "company" TEXT;

-- CreateTable
CREATE TABLE "CustomerAccess" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "accessType" "AccessType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccess_customerId_employeeId_key" ON "CustomerAccess"("customerId", "employeeId");

-- AddForeignKey
ALTER TABLE "CustomerAccess" ADD CONSTRAINT "CustomerAccess_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAccess" ADD CONSTRAINT "CustomerAccess_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
