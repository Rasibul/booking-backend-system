import { Request, Response } from "express";
import { bookingService } from "./booking.service";

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

export const bookingController = {
    createBooking: createBookingHandler,
};