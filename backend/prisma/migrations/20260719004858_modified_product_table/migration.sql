/*
  Warnings:

  - You are about to drop the column `priceAdP` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `wholesalePriceDZD` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `CreditLedger` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productPriceDZD` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('ELECTRONICS', 'FASHION', 'GROCERY', 'HOME', 'BEAUTY', 'SPORTS', 'TOYS', 'BOOKS', 'OTHER');

-- CreateEnum
CREATE TYPE "WalletLogType" AS ENUM ('SUBSCRIPTION', 'PURCHASE', 'REFUND', 'ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "CreditLedger" DROP CONSTRAINT "CreditLedger_userId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "priceAdP",
DROP COLUMN "stockQuantity",
DROP COLUMN "wholesalePriceDZD",
ADD COLUMN     "productPriceDZD" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "productType" TEXT NOT NULL;

-- DropTable
DROP TABLE "CreditLedger";

-- DropEnum
DROP TYPE "LedgerType";

-- CreateTable
CREATE TABLE "WalletLog" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "WalletLogType" NOT NULL,
    "referenceId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WalletLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalletLog" ADD CONSTRAINT "WalletLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
