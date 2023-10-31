/*
  Warnings:

  - You are about to drop the column `statusId` on the `bond` table. All the data in the column will be lost.
  - You are about to drop the column `permissionId` on the `bond_permission` table. All the data in the column will be lost.
  - You are about to drop the column `deparmentId` on the `consultation` table. All the data in the column will be lost.
  - You are about to drop the column `consultationId` on the `prescription` table. All the data in the column will be lost.
  - You are about to alter the column `date_time` on the `remider` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `permissionId` on the `role_permission` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `user` table. All the data in the column will be lost.
  - Added the required column `status_id` to the `Bond` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_id` to the `Bond_Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deparment_id` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consultation_id` to the `Prescription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_id` to the `Role_Permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bond` DROP FOREIGN KEY `Bond_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `bond_permission` DROP FOREIGN KEY `Bond_Permission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `consultation` DROP FOREIGN KEY `Consultation_deparmentId_fkey`;

-- DropForeignKey
ALTER TABLE `prescription` DROP FOREIGN KEY `Prescription_consultationId_fkey`;

-- DropForeignKey
ALTER TABLE `role_permission` DROP FOREIGN KEY `Role_Permission_permissionId_fkey`;

-- AlterTable
ALTER TABLE `bond` DROP COLUMN `statusId`,
    ADD COLUMN `status_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `bond_permission` DROP COLUMN `permissionId`,
    ADD COLUMN `permission_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `consultation` DROP COLUMN `deparmentId`,
    ADD COLUMN `deparment_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `prescription` DROP COLUMN `consultationId`,
    ADD COLUMN `consultation_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `remider` MODIFY `date_time` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `role_permission` DROP COLUMN `permissionId`,
    ADD COLUMN `permission_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `picture`;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bio` VARCHAR(300) NULL,
    `picture_url` VARCHAR(300) NULL,
    `user_id` INTEGER NULL,

    UNIQUE INDEX `Profile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role_Permission` ADD CONSTRAINT `Role_Permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bond` ADD CONSTRAINT `Bond_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `Bond_Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bond_Permission` ADD CONSTRAINT `Bond_Permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_deparment_id_fkey` FOREIGN KEY (`deparment_id`) REFERENCES `Medical_Specialty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_consultation_id_fkey` FOREIGN KEY (`consultation_id`) REFERENCES `Consultation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
