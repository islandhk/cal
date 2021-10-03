-- CreateEnum
CREATE TYPE "School" AS ENUM ('LPH', 'IS');

-- CreateTable
CREATE TABLE "Main" (
    "user" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "school" "School" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Main.user_unique" ON "Main"("user");
