import express from "express";
import {
  createCoupon,
  getCoupons,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

router.route("/")
  .post(createCoupon)
  .get(getCoupons);

router.post("/validate", validateCoupon);

router.route("/:id").delete(deleteCoupon);

export default router;