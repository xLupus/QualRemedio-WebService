/*
  Warnings:

  - You are about to alter the column `date_time` on the `remider` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `picture` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `remider` MODIFY `date_time` DATETIME NOT NULL;

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
