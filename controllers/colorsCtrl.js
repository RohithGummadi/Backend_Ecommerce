import asyncHandler from "express-async-handler"
import Color from "../models/Color.js";

//@desc Create new color
//@route POST /api/v1/colors
//@access Private/Admin
export const createColorCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;
    //if Color exits
    const colorFound = await Color.findOne({name: name.toLowerCase()})
    if(colorFound){
        throw new Error("Color already found");
    }
    //Create
    const color = await Color.create({
        name: name.toLowerCase(),
        user:req.userAuthId,
    });

    res.json({
        status:"success",
        message: "Color created succesfully",
        color
    });
});


//@desc fetch all colors
//@route GET /api/v1/colors
//@access public
export const getAllColorsCtrl = asyncHandler(async(req,res)=>{
    const colors = await Color.find();
    res.json({
        status:"success",
        message:"Colors fetched succesfully",
        colors,
    });
});


//@desc get single color
//@route GET /api/v1/colors/:id
//@access public
export const getSingleColorCtrl = asyncHandler(async(req,res)=>{
    const color = await Color.findById(req.params.id)
    res.json({
        status:"success",
        message:"Color fetched succesfully",
        color
    })
});


//@desc update color
//@route PUT /api/v1/colors/:id
//@access Private
export const updateColorCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;
    const color =await Color.findByIdAndUpdate(req.params.id, {
        name
    },
    {
        new: true,
    });
    res.json({
        status:'success',
        message:"Color updated succesfully",
        color,
    });
});


//@desc delete color
//@route Delete /api/v1/colors/:id
//@access Private

export const deleteColorCtrl = asyncHandler(async(req,res)=>{
    const color = await Color.findByIdAndDelete(req.params.id);
    res.json({
        status:'success',
        message:"Color deleted succesfully",
    });
});

