import Brand from "../models/Brand.js";
import asyncHandler from "express-async-handler"


//@desc Create new Brand
//@route POST /api/v1/brands
//@access Private/Admin
export const createBrandCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;
    //if brand exits
    const brandFound = await Brand.findOne({name: name.toLowerCase()})
    if(brandFound){
        throw new Error("Brand already found");
    }
    //Create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user:req.userAuthId,
    });

    res.json({
        status:"success",
        message: "Brand created succesfully",
        brand
    });
});


//@desc fetch all brands
//@route POST /api/v1/brands
//@access public
export const getAllBrandsCtrl = asyncHandler(async(req,res)=>{
    const brands = await Brand.find();
    res.json({
        status:"success",
        message:"Brands fetched succesfully",
        brands,
    });
});


//@desc get single brand
//@route POST /api/v1/brands/:id
//@access public
export const getSingleBrandCtrl = asyncHandler(async(req,res)=>{
    const brand = await Brand.findById(req.params.id)
    res.json({
        status:"success",
        message:"Brand fetched succesfully",
        brand
    })
});


//@desc update brand
//@route PUT /api/v1/brands/:id
//@access Private
export const updateBrandCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;
    const brand =await Brand.findByIdAndUpdate(req.params.id, {
        name
    },
    {
        new: true,
    });
    res.json({
        status:'success',
        message:"Brand updated succesfully",
        Brand,
    });
});


//@desc delete brand
//@route Delete /api/v1/brands/:id
//@access Private

export const deleteBrandCtrl = asyncHandler(async(req,res)=>{
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status:'success',
        message:"Brand deleted succesfully",
    });
});

