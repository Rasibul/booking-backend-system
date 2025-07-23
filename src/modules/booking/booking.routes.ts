import { Router } from 'express';
const router = Router();
import { bookingController } from './booking.controller';


router.post('/bookings', bookingController.createBooking);

router.get('/bookings', bookingController.getBookings);

router.get('/available-slots', bookingController.getAvailableSlots);

router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;