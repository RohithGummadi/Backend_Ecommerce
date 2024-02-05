import Review from "../models/Review.js";
import AsyncHandler from "express-async-handler";
import Product from "../models/Product.js";

//@desc Create new review
//@route POST /api/v1/reviews
//@access Private/Admin

export const createReviewCtrl = AsyncHandler(async(req,res)=>{
    const {product, message, rating} = req.body;
    //Find the product
    const {productID} = req.params;
    const productFound = await Product.findById(productID).populate("reviews");
    if (!productFound){
        throw new Error("Product Not Found")
    }
    //Check id user already reviewed the product
    const hasReviewed = productFound?.reviews?.find((review)=>{
        return review?.user.toString() == req?.userAuthId?.toString();
    })
    if(hasReviewed){
        throw new Error("You already reviewd this product")
    }

    const review = await Review.create({
        message,
        rating,
        product:productFound?._id,
        user:req.userAuthId,
    })
    //Push review into product found
    productFound.reviews.push(review?._id)
    await productFound.save();
    res.status(201).json({
        success: true,
        message: "Review created succesfully",
    })
});
