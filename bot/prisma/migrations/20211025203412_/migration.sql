/*
  Warnings:

  - You are about to drop the column `school` on the `Main` table. All the data in the column will be lost.
  - Added the required column `service` to the `Main` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Service" AS ENUM ('GCAL', 'GATEWAY');

-- AlterTable
ALTER TABLE "Main" DROP COLUMN "school",
ADD COLUMN     "service" "Service" NOT NULL;

-- DropEnum
DROP TYPE "School";
