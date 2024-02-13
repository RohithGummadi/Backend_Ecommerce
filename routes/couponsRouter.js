import express from "express";
import { createCoupon, getAllCouponsCtrl, getCouponCtrl, updateCouponCtrl, deleteCouponCtrl } from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { get } from "http";
const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, createCoupon);
couponsRouter.get("/", isLoggedIn, getAllCouponsCtrl);
couponsRouter.get("/:id", getCouponCtrl);
couponsRouter.put("/update/:id",updateCouponCtrl)
couponsRouter.delete("/delete/:id", deleteCouponCtrl)

export default couponsRouter;