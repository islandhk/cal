/*
  Warnings:

  - The values [LPH] on the enum `School` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "School_new" AS ENUM ('LPS', 'IS');
ALTER TABLE "Main" ALTER COLUMN "school" TYPE "School_new" USING ("school"::text::"School_new");
ALTER TYPE "School" RENAME TO "School_old";
ALTER TYPE "School_new" RENAME TO "School";
DROP TYPE "School_old";
COMMIT;
