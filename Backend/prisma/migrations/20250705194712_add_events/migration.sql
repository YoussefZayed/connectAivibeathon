-- CreateTable
CREATE TABLE "eventsData" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_name" TEXT NOT NULL,
    "event_description" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "eventsData_pkey" PRIMARY KEY ("id")
);
