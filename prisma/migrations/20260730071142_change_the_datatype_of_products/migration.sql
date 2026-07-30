/*
  Warnings:

  - Changed the type of `customerData` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerData",
ADD COLUMN     "customerData" JSONB NOT NULL;
