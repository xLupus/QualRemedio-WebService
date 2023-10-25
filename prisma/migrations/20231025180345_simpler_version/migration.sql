/*
  Warnings:

  - You are about to drop the column `roleId` on the `carer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `carer` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `employeer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `employeer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `remider` table. All the data in the column will be lost.
  - You are about to alter the column `date_time` on the `remider` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `roleId` on the `role_permission` table. All the data in the column will be lost.
  - You are about to drop the `medical_department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `no_register_carer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `no_register_doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `no_register_patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `picture` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Carer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[specialty_id]` on the table `Carer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[specialty_id]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Employeer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `specialty_id` to the `Carer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Carer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty_id` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Employeer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Remider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `Role_Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `carer` DROP FOREIGN KEY `Carer_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `carer` DROP FOREIGN KEY `Carer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `consultation` DROP FOREIGN KEY `Consultation_deparmentId_fkey`;

-- DropForeignKey
ALTER TABLE `doctor` DROP FOREIGN KEY `Doctor_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `doctor` DROP FOREIGN KEY `Doctor_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `doctor` DROP FOREIGN KEY `Doctor_userId_fkey`;

-- DropForeignKey
ALTER TABLE `employeer` DROP FOREIGN KEY `Employeer_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `employeer` DROP FOREIGN KEY `Employeer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_carer` DROP FOREIGN KEY `No_Register_Carer_created_by_user_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_carer` DROP FOREIGN KEY `No_Register_Carer_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_carer` DROP FOREIGN KEY `No_Register_Carer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_doctor` DROP FOREIGN KEY `No_Register_Doctor_created_by_user_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_doctor` DROP FOREIGN KEY `No_Register_Doctor_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_doctor` DROP FOREIGN KEY `No_Register_Doctor_userId_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_patient` DROP FOREIGN KEY `No_Register_Patient_created_by_user_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_patient` DROP FOREIGN KEY `No_Register_Patient_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `no_register_patient` DROP FOREIGN KEY `No_Register_Patient_userId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `password` DROP FOREIGN KEY `Password_userId_fkey`;

-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_userId_fkey`;

-- DropForeignKey
ALTER TABLE `picture` DROP FOREIGN KEY `Picture_userId_fkey`;

-- DropForeignKey
ALTER TABLE `remider` DROP FOREIGN KEY `Remider_userId_fkey`;

-- DropForeignKey
ALTER TABLE `role_permission` DROP FOREIGN KEY `Role_Permission_roleId_fkey`;

-- AlterTable
ALTER TABLE `carer` DROP COLUMN `roleId`,
    DROP COLUMN `userId`,
    ADD COLUMN `specialty_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `departmentId`,
    DROP COLUMN `roleId`,
    DROP COLUMN `userId`,
    DROP COLUMN `verified`,
    ADD COLUMN `specialty_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `employeer` DROP COLUMN `roleId`,
    DROP COLUMN `userId`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `userId`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `remider` DROP COLUMN `userId`,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    MODIFY `date_time` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `role_permission` DROP COLUMN `roleId`,
    ADD COLUMN `role_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `token_blacklist` MODIFY `token` VARCHAR(600) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `picture` VARCHAR(191) NOT NULL,
    ADD COLUMN `role_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `medical_department`;

-- DropTable
DROP TABLE `no_register_carer`;

-- DropTable
DROP TABLE `no_register_doctor`;

-- DropTable
DROP TABLE `no_register_patient`;

-- DropTable
DROP TABLE `password`;

-- DropTable
DROP TABLE `patient`;

-- DropTable
DROP TABLE `picture`;

-- CreateTable
CREATE TABLE `Medical_Specialty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Carer_user_id_key` ON `Carer`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Carer_specialty_id_key` ON `Carer`(`specialty_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Doctor_user_id_key` ON `Doctor`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Doctor_specialty_id_key` ON `Doctor`(`specialty_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Employeer_user_id_key` ON `Employeer`(`user_id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_specialty_id_fkey` FOREIGN KEY (`specialty_id`) REFERENCES `Medical_Specialty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carer` ADD CONSTRAINT `Carer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carer` ADD CONSTRAINT `Carer_specialty_id_fkey` FOREIGN KEY (`specialty_id`) REFERENCES `Medical_Specialty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employeer` ADD CONSTRAINT `Employeer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role_Permission` ADD CONSTRAINT `Role_Permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Remider` ADD CONSTRAINT `Remider_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_deparmentId_fkey` FOREIGN KEY (`deparmentId`) REFERENCES `Medical_Specialty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
