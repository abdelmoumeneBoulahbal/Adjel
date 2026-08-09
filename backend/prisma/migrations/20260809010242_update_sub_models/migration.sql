/*
  Warnings:

  - You are about to drop the column `fullName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Mandate` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `shopName` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `productPriceDZD` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `merchantShare` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `settledAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `settlementStatus` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `WalletLog` table. All the data in the column will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriberProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionTier` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `Mandate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `Mandate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPriceDZD` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `productType` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clientId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchantId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `WalletLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('ONE_MONTH', 'SIX_MONTHS', 'TWELVE_MONTHS');

-- AlterEnum
ALTER TYPE "AccountStatus" ADD VALUE 'PENDING_ACTIVATION';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentType" ADD VALUE 'BUSINESS_REGISTRATION';
ALTER TYPE "DocumentType" ADD VALUE 'TAX_CERTIFICATE';
ALTER TYPE "DocumentType" ADD VALUE 'BUSINESS_ADDRESS_PROOF';

-- AlterEnum
ALTER TYPE "ProductType" ADD VALUE 'SERVICES';

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "Mandate" DROP CONSTRAINT "Mandate_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriberProfile" DROP CONSTRAINT "SubscriberProfile_tierId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriberProfile" DROP CONSTRAINT "SubscriberProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "WalletLog" DROP CONSTRAINT "WalletLog_userId_fkey";

-- DropIndex
DROP INDEX "Mandate_userId_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mandate" DROP COLUMN "userId",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "isActive",
DROP COLUMN "shopName",
ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT 'REGISTERED',
ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MERCHANT';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productPriceDZD",
ADD COLUMN     "sellingPriceDZD" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "productType",
ADD COLUMN     "productType" "ProductType" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "merchantShare",
DROP COLUMN "settledAt",
DROP COLUMN "settlementStatus",
DROP COLUMN "userId",
ADD COLUMN     "clientId" INTEGER NOT NULL,
ADD COLUMN     "merchantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WalletLog" DROP COLUMN "userId",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "SubscriberProfile";

-- DropTable
DROP TABLE "SubscriptionTier";

-- CreateTable
CREATE TABLE "ClientSubscriptionTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "monthlyFeeDZD" DOUBLE PRECISION NOT NULL,
    "creditLimitTierDZD" DOUBLE PRECISION NOT NULL,
    "minSalaryDZD" DOUBLE PRECISION NOT NULL,
    "maxSalaryDZD" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientSubscriptionTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantSubscriptionTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "monthlyFeeDZD" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantSubscriptionTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSubscription" (
    "id" SERIAL NOT NULL,
    "salaryAmount" DOUBLE PRECISION NOT NULL,
    "salaryDay" INTEGER NOT NULL,
    "salarySource" TEXT NOT NULL,
    "creditLimitDZD" DOUBLE PRECISION NOT NULL,
    "creditUsedDZD" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creditResetDate" TIMESTAMP(3) NOT NULL,
    "contractStart" TIMESTAMP(3) NOT NULL,
    "contractEnd" TIMESTAMP(3) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "clientId" INTEGER NOT NULL,
    "tierId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantSubscription" (
    "id" SERIAL NOT NULL,
    "contractStart" TIMESTAMP(3) NOT NULL,
    "contractEnd" TIMESTAMP(3) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "tierId" INTEGER NOT NULL,

    CONSTRAINT "MerchantSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientDocument" (
    "id" SERIAL NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "ClientDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantDocument" (
    "id" SERIAL NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "merchantId" INTEGER NOT NULL,

    CONSTRAINT "MerchantDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantEarning" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "settlementStatus" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "merchantId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "MerchantEarning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientSubscriptionTier_name_key" ON "ClientSubscriptionTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantSubscriptionTier_name_key" ON "MerchantSubscriptionTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantEarning_transactionId_key" ON "MerchantEarning"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Mandate_clientId_key" ON "Mandate"("clientId");

-- AddForeignKey
ALTER TABLE "ClientSubscription" ADD CONSTRAINT "ClientSubscription_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSubscription" ADD CONSTRAINT "ClientSubscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "ClientSubscriptionTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantSubscription" ADD CONSTRAINT "MerchantSubscription_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantSubscription" ADD CONSTRAINT "MerchantSubscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "MerchantSubscriptionTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDocument" ADD CONSTRAINT "ClientDocument_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantDocument" ADD CONSTRAINT "MerchantDocument_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mandate" ADD CONSTRAINT "Mandate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletLog" ADD CONSTRAINT "WalletLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantEarning" ADD CONSTRAINT "MerchantEarning_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantEarning" ADD CONSTRAINT "MerchantEarning_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
