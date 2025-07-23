import Prisma from "../../config/db"
import { BookingInput, GetBookingsFilter } from "./booking.interface"
import { subMinutes, addMinutes, isBefore, differenceInMinutes } from "date-fns";

const createBookingService = async (input: BookingInput) => {
    const { resource, startTime, endTime, requestedBy } = input;

    if (!isBefore(startTime, endTime)) {
        throw new Error("Start time must be before end time");
    }

    const duration = differenceInMinutes(endTime, startTime);
    if (duration < 15) {
        throw new Error("Booking must be at least 15 minutes long");
    }

    // 10-minute buffer before and after
    const bufferStart = subMinutes(startTime, 10);
    const bufferEnd = addMinutes(endTime, 10);

    const conflict = await Prisma.booking.findFirst({
        where: {
            resource,
            startTime: {
                lt: bufferEnd,
            },
            endTime: {
                gt: bufferStart,
            },
        },
    });

    if (conflict) {
        throw new Error(
            `Booking conflict with an existing booking (${conflict.startTime} - ${conflict.endTime})`
        );
    }

    const booking = await Prisma.booking.create({
        data: {
            resource,
            startTime,
            endTime,
            requestedBy,
        },
    });

    return booking;
};

const getBookingsService = async (filter: GetBookingsFilter) => {
    const whereClause: any = {};

    if (filter.resource) {
        whereClause.resource = filter.resource;
    }

    if (filter.date) {
        // Filter bookings where startTime or endTime falls within the date
        const dayStart = new Date(`${filter.date}T00:00:00.000Z`);
        const dayEnd = new Date(`${filter.date}T23:59:59.999Z`);

        whereClause.OR = [
            {
                startTime: {
                    gte: dayStart,
                    lte: dayEnd,
                },
            },
            {
                endTime: {
                    gte: dayStart,
                    lte: dayEnd,
                },
            },
        ];
    }

    const bookings = await Prisma.booking.findMany({
        where: whereClause,
        orderBy: { startTime: 'asc' },
    });
    return bookings;
};





export const bookingService = {
    createBooking: createBookingService,
    getBookings: getBookingsService,
}