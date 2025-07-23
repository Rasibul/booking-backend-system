import { Router } from 'express';
const router = Router();
import { bookingController } from './booking.controller';


router.post('/', bookingController.createBooking);

router.get('/', bookingController.getBookings);

export const bookingRouter = router;