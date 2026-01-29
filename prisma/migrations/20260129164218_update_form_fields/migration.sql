/*
  Warnings:

  - You are about to drop the column `branchCount` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `returnPolicyPdf` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `stockAvailability` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "branchCount",
DROP COLUMN "returnPolicyPdf",
DROP COLUMN "stockAvailability",
ADD COLUMN     "commissionShippingPolicy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privacyPolicy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productImagePolicy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "returnRefundPolicy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taxCertificatePdf" TEXT,
ADD COLUMN     "termsOfUse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whistleblowingPolicy" BOOLEAN NOT NULL DEFAULT false;
