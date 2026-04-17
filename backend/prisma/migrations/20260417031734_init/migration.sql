-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('Silver', 'Gold', 'Diamond');

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" "SeatType" NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
