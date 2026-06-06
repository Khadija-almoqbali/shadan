import path from 'path';
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import productRoutes from "./routes/productRoute.js";
import userRoutes from "./routes/userRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js'


const port = process.env.PORT || 8000;

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies
app.use(cookieParser());


// base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// main routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/upload', uploadRoutes);

app.use("/api/payments", paymentRoutes);

app.get("/api/config/amwalpay", (req, res) => {
  if (!process.env.AMWALPAY_PUBLIC_KEY) {
    return res.status(500).json({ message: "AmwalPay key missing" });
  }

  res.json({
    publicKey: process.env.AMWALPAY_PUBLIC_KEY,
  });
});
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`server running on port ${port}`)
);