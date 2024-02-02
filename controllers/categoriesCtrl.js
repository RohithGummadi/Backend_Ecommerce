import Category from "../models/Category.js";
import asyncHandler from "express-async-handler"


//@desc Create new Category
//@route POST /api/v1/categories
//@access Private/Admin
export const createCategoryCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;
    const categoryFound = await Category.findOne({ name: name.toLowerCase() });

    if(categoryFound){
        throw new Error("Category found");
    }
    //Create
    const category = await Category.create({
        name: name.toLowerCase(),
        user:req.userAuthId,
    });

    res.json({
        status:"success",
        message: "Category created succesfully",
        category
    });
});



//@desc fetch all categories
//@route POST /api/v1/categories
//@access public
export const getAllCategoriesCtrl = asyncHandler(async(req,res)=>{
    const categories = await Category.find();
    res.json({
        status:"success",
        message:"Categories fetched succesfully",
        categories,
    })
});


//@desc get single category 
//@route POST /api/v1/categories/:id
//@access public
export const getSingleCategoriesCtrl = asyncHandler(async(req,res)=>{
    const category = await Category.findById(req.params.id)
    res.json({
        status:"success",
        message:"Category fetched succesfully",
        category
    })
});


//@desc update category 
//@route PUT /api/v1/categories/:id
//@access Private
export const updateCategoryCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;
    const category =await Category.findByIdAndUpdate(req.params.id, {
        name
    },
    {
        new: true,
    });
    res.json({
        status:'success',
        message:"category updated succesfully",
        category,
    });
});


//@desc delete category 
//@route Delete /api/v1/categories/:id
//@access Private
export const deleteCategoryCtrl = asyncHandler(async(req,res)=>{
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
        status:'success',
        message:"category deleted succesfully",
    });
});

