import express from "express";
import { createCoupon, getAllCouponsCtrl, getCouponCtrl, updateCouponCtrl, deleteCouponCtrl } from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { get } from "http";
import isAdmin from "../middlewares/isAdmin.js";
const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, isAdmin, createCoupon);
couponsRouter.get("/", isLoggedIn, getAllCouponsCtrl);
couponsRouter.get("/:id", getCouponCtrl);
couponsRouter.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl)
couponsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl)

export default couponsRouter;