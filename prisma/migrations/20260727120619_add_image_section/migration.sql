/*
  Warnings:

  - Added the required column `image` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item" ADD COLUMN     "image" JSONB NOT NULL;
