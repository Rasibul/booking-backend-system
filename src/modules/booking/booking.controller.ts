import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { get } from "http";

const createBookingHandler = async (req: Request, res: Response) => {
    try {
        const { resource, startTime, endTime, requestedBy } = req.body;

        if (!resource || !startTime || !endTime || !requestedBy) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const booking = await bookingService.createBooking({
            resource,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            requestedBy,
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            data: booking,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};


const getBookingsHandler = async (req: Request, res: Response) => {
    try {
        const { resource, date } = req.query as { resource?: string; date?: string };
        const bookings = await bookingService.getBookings({ resource, date });

        res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully',
            data: bookings,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

export const bookingController = {
    createBooking: createBookingHandler,
    getBookings: getBookingsHandler,
};