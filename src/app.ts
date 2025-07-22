import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API entry point
app.use("/api", router);

app.get("/", (_, res) => {
    res.send("🚀 Server is running!");
});

export default app;