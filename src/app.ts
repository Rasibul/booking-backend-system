import express from "express";
import cors from "cors";
import dotenv from "dotenv";




dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const bookingRouter = require("./modules/booking/booking.routes");

app.use("/api", bookingRouter);

app.get("/", (_, res) => {
    res.send("🚀 Server is running!");
});

export default app;