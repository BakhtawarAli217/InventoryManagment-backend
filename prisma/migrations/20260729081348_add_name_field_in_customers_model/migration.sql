/*
  Warnings:

  - Added the required column `name` to the `Customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "name" TEXT NOT NULL;
