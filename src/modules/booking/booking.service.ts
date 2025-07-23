import { get } from "http";
import Prisma from "../../config/db"
import { BookingInput, GetBookingsFilter } from "./booking.interface"
import { subMinutes, addMinutes, isBefore, differenceInMinutes, max } from "date-fns";

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



const getAvailableSlotsService = async (
    data: GetBookingsFilter
) => {
    if (!data.resource || !data.date) {
        throw new Error('resource and date are required');
    }

    const dayStart = new Date(`${data.date}T08:00:00.000Z`);
    const dayEnd = new Date(`${data.date}T18:00:00.000Z`);

    const bookings = await Prisma.booking.findMany({
        where: {
            resource: data.resource,
            OR: [
                {
                    startTime: {
                        gte: dayStart,
                        lt: dayEnd,
                    },
                },
                {
                    endTime: {
                        gt: dayStart,
                        lte: dayEnd,
                    },
                },
                {
                    AND: [
                        {
                            startTime: { lt: dayStart },
                        },
                        {
                            endTime: { gt: dayEnd },
                        },
                    ],
                },
            ],
        },
        orderBy: { startTime: 'asc' },
    });

    const availableSlots = [];
    let slotStart = dayStart;

    for (const booking of bookings) {
        if (slotStart < booking.startTime) {
            availableSlots.push({
                startTime: slotStart,
                endTime: booking.startTime,
            });
        }
        slotStart = new Date(
            Math.max(slotStart.getTime(), booking.endTime.getTime())
        );
    }

    if (slotStart < dayEnd) {
        availableSlots.push({
            startTime: slotStart,
            endTime: dayEnd,
        });
    }

    return availableSlots;
};

const deleteBookingService = async (id: string) => {
    const booking = await Prisma.booking.delete({
        where: {
            id,
        },
    });
    return booking;
};


export const bookingService = {
    createBooking: createBookingService,
    getBookings: getBookingsService,
    getAvailableSlots: getAvailableSlotsService,
    deleteBooking: deleteBookingService,
}