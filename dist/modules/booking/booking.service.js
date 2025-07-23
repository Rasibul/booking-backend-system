"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const date_fns_1 = require("date-fns");
const MAX_BOOKING_DURATION_MINUTES = 120;
const createBookingService = async (input) => {
    const { resource, startTime, endTime, requestedBy } = input;
    if (!(0, date_fns_1.isBefore)(startTime, endTime)) {
        throw new Error("Start time must be before end time");
    }
    const duration = (0, date_fns_1.differenceInMinutes)(endTime, startTime);
    if (duration < 15) {
        throw new Error("Booking must be at least 15 minutes long");
    }
    if (duration > MAX_BOOKING_DURATION_MINUTES) {
        throw new Error("Booking cannot exceed 2 hours");
    }
    const bufferStart = (0, date_fns_1.subMinutes)(startTime, 10);
    const bufferEnd = (0, date_fns_1.addMinutes)(endTime, 10);
    const conflict = await db_1.default.booking.findFirst({
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
        throw new Error(`Booking conflict with an existing booking (${conflict.startTime} - ${conflict.endTime})`);
    }
    const booking = await db_1.default.booking.create({
        data: {
            resource,
            startTime,
            endTime,
            requestedBy,
        },
    });
    return booking;
};
const getBookingsService = async (filter) => {
    const whereClause = {};
    if (filter.resource) {
        whereClause.resource = filter.resource;
    }
    if (filter.date) {
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
    const bookings = await db_1.default.booking.findMany({
        where: whereClause,
        orderBy: { startTime: "asc" },
    });
    const now = new Date();
    const bookingsWithStatus = bookings.map((booking) => {
        let status;
        if (booking.endTime < now) {
            status = "Past";
        }
        else if (booking.startTime <= now && booking.endTime >= now) {
            status = "Ongoing";
        }
        else {
            status = "Upcoming";
        }
        return {
            ...booking,
            status,
        };
    });
    return bookingsWithStatus;
};
const getAvailableSlotsService = async (data) => {
    if (!data.resource || !data.date) {
        throw new Error('resource and date are required');
    }
    const dayStart = new Date(`${data.date}T08:00:00.000Z`);
    const dayEnd = new Date(`${data.date}T18:00:00.000Z`);
    const bookings = await db_1.default.booking.findMany({
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
        slotStart = new Date(Math.max(slotStart.getTime(), booking.endTime.getTime()));
    }
    if (slotStart < dayEnd) {
        availableSlots.push({
            startTime: slotStart,
            endTime: dayEnd,
        });
    }
    return availableSlots;
};
const deleteBookingService = async (id) => {
    const booking = await db_1.default.booking.delete({
        where: {
            id,
        },
    });
    return booking;
};
exports.bookingService = {
    createBooking: createBookingService,
    getBookings: getBookingsService,
    getAvailableSlots: getAvailableSlotsService,
    deleteBooking: deleteBookingService,
};
