import { Router } from "express";
import { bookingRouter } from "../modules/booking/booking.routes";


const router = Router();

router.use('/bookings', bookingRouter);

export default router;