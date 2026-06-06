import express from "express";
import { createAmwalPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/amwal", createAmwalPayment);

export default router;