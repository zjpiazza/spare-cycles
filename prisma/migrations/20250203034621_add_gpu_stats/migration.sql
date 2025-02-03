-- CreateTable
CREATE TABLE "GpuStats" (
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

    CONSTRAINT "GpuStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GpuStats_timestamp_idx" ON "GpuStats"("timestamp" DESC);
