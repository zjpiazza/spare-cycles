/*
  Warnings:

  - You are about to drop the `GpuStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "GpuStats";

-- CreateTable
CREATE TABLE "gpu_stats" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "gpu_name" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "fan_speed" INTEGER NOT NULL,
    "memory_total" INTEGER NOT NULL,
    "memory_used" INTEGER NOT NULL,
    "utilization" INTEGER NOT NULL,
    "power_draw" DECIMAL(65,30) NOT NULL,
    "power_limit" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "gpu_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gpu_stats_timestamp_idx" ON "gpu_stats"("timestamp" DESC);
