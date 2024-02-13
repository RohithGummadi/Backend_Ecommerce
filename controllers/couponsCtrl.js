import Coupon from "../models/Coupon.js";
import AsyncHandler from "express-async-handler";

//@desc create new coupon,
//@route POST /api/v1/coupons
//@access Private/Admin

export const createCoupon = AsyncHandler(async(req,res)=>{
    //check if admin
    //check if coupon already exist
    const {code, startDate, endDate, discount} = req.body

    const couponExists = await Coupon.findOne({code});
    if(couponExists){
        throw new Error("Coupon already exists");
    }
    //check if discount is a number
    if(isNaN(discount)){
        throw new Error("Discount value must be a number");
    }

    const coupon = await Coupon.create({
        code: code?.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId,
    });

    res.status(201).json({
        status: "success",
        message: "Coupon created succesfully",
        coupon
    });

});

//@desc  GET all coupons
//@route GET /api/v1/coupons
//@access Private/Admin


export const getAllCouponsCtrl = AsyncHandler(async(req,res)=>{
    const coupons = await Coupon.find();
    res.status(201).json({
        status: "success",
        message: "Coupons fetched succesfully",
        coupons,
    });
})


//@desc GET single coupon 
//@route GET /api/v1/coupons/:id
//@access Private/Admin 

export const getCouponCtrl = AsyncHandler(async(req,res)=>{
    const coupon = await Coupon.findById(req.params.id)
    res.status(201).json({
        status: "success",
        message: "Coupon fetched succesfully",
        coupon
    });

})


export const updateCouponCtrl = AsyncHandler(async(req,res)=>{
    const {code, startDate, endDate, discount} = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
        code: code?.toUpperCase(),
        discount, 
        startDate,
        endDate
    }, {
        new: true,
    });
    res.status(201).json({
        status: "success",
        message: "Coupon updated succesfully",
        coupon
    });

});



export const deleteCouponCtrl = AsyncHandler(async(req,res)=>{
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.status(201).json({
        status: "success",
        message: "Coupon deleted succesfully",
        coupon
    });
})