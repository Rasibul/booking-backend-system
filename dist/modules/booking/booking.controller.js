"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("./booking.service");
const createBookingHandler = async (req, res) => {
    try {
        const { resource, startTime, endTime, requestedBy } = req.body;
        if (!resource || !startTime || !endTime || !requestedBy) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }
        const booking = await booking_service_1.bookingService.createBooking({
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
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};
const getBookingsHandler = async (req, res) => {
    try {
        const { resource, date } = req.query;
        const bookings = await booking_service_1.bookingService.getBookings({ resource, date });
        res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully',
            data: bookings,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
const getAvailableSlotsHandler = async (req, res) => {
    try {
        const { resource, date } = req.query;
        if (!resource || !date) {
            return res.status(400).json({
                success: false,
                message: 'resource and date query parameters are required',
            });
        }
        const slots = await booking_service_1.bookingService.getAvailableSlots({
            resource, date
        });
        res.status(200).json({
            success: true,
            message: 'Available slots fetched successfully',
            data: slots,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
const deleteBookingHandler = async (req, res) => {
    try {
        const bookingId = req.params.id;
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required.",
            });
        }
        await booking_service_1.bookingService.deleteBooking(bookingId);
        return res.status(200).json({
            success: true,
            message: "Booking deleted successfully.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};
exports.bookingController = {
    createBooking: createBookingHandler,
    getBookings: getBookingsHandler,
    getAvailableSlots: getAvailableSlotsHandler,
    deleteBooking: deleteBookingHandler,
};
