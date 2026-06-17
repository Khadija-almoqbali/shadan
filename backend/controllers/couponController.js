import asyncHandler from "../middleware/asyncHandler.js";
import Coupon from "../models/couponModel.js";



// @desc Create coupon
// @route POST /api/coupons
// @access Admin
export const createCoupon = asyncHandler(async (req, res) => {

  const {

    code,

    discountType,

    discountValue,

    minimumPurchase,

    expiryDate,

  } = req.body;

  const cleanCode = code.trim().toUpperCase();

  const couponExists = await Coupon.findOne({

    code: cleanCode,

  });

  if (couponExists) {

    res.status(400);

    throw new Error("Coupon already exists");

  }

  const coupon = await Coupon.create({

    code: cleanCode,

    discountType,

    discountValue,

    minimumPurchase,

    expiryDate,

  });

  res.status(201).json(coupon);

});



// @desc Get all coupons
// @route GET /api/coupons
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

// @desc Delete coupon
// @route DELETE /api/coupons/:id
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();
  res.json({ message: "Coupon removed" });
});

// @desc Validate coupon (IMPORTANT for cart)
// @route POST /api/coupons/validate
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, total } = req.body;

const cleanCode = code.trim().toUpperCase();

const coupon = await Coupon.findOne({
  code: cleanCode,
});

  if (!coupon) {

    return res.status(404).json({ message: "Invalid coupon" });

  }

  if (!coupon.isActive) {

    return res.status(400).json({ message: "Coupon not active" });

  }

  if (total < coupon.minimumPurchase) {

    return res.status(400).json({

      message: `Minimum purchase is ${coupon.minimumPurchase}`,

    });

  }

  let discount = 0;

  if (coupon.discountType === "percentage") {

    discount = (total * coupon.discountValue) / 100;

  } else {

    discount = coupon.discountValue;

  }

  res.json({

    success: true,

    discount,

    message: "Coupon applied successfully",

  });
});