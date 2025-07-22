import { Router } from 'express';
const router = Router();
import { bookingController } from './booking.controller';


router.post('/', bookingController.createBooking);

export const bookingRouter = router;