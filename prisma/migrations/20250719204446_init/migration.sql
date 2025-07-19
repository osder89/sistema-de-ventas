/*
  Warnings:

  - You are about to drop the column `birthCountry` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "birthCountry",
DROP COLUMN "middleName";
