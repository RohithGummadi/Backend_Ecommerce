import Product from "../models/Product.js";
import AsyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";


//@desc Create new product
//@route POST /api/v1/products
//@access Private/Admin

export const createProductCtrl = AsyncHandler(async(req,res)=>{

    const convertedImgs = req.files.map((file)=>file.path)

    const {name, description, category, sizes, colors, user, price, totalQty, brand} = req.body;
    //product exists
    const productExists = await Product.findOne({name});
    if(productExists){
        throw new Error("Product Already exists");

    }

    //find category
    const categoryFound = await Category.findOne({
        name: category.toLowerCase(),
    })
    if(!categoryFound){
        throw new Error(
            "Category not found, please create category first or check the category name"
        );
    }

    //find brand

    const brandFound = await Brand.findOne({
        name: brand?.toLowerCase(),
    })
    if (!brandFound){
        throw new Error(
            "Brand not found, please create a brand first or check the brand name"
        );
    }

    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand,
        images: convertedImgs

    });

    //push the product into category
    categoryFound.products.push(product._id)
    //resave
    await categoryFound.save()


    //push the product into brand
    brandFound.products.push(product._id)
    //resave
    await brandFound.save()

    //send response
    res.json({
        status: "Success",
        message: "Product created succesfully",
        product
    })
});


//@dec Get all products
//@route GET /api/v1/products
//@access public
export const getProductsCtrl = AsyncHandler(async(req,res)=>{
    //console.log(req.query); //we will get the query parameters with this
   
    //query
    let productQuery = Product.find()
    //console.log(productQuery)

    //search by name ?name=hats   (additional payload sending)
    if (req.query.name){
        productQuery = productQuery.find({
            name:{$regex: req.query.name, $options:'i'}
        });
    }

    //filter by brand
    if (req.query.brand){
        productQuery = productQuery.find({
            brand:{$regex: req.query.brand, $options:'i'}
        });
    }
    
    //filter by category
    if (req.query.category){
        productQuery = productQuery.find({
            category:{$regex: req.query.category, $options:'i'}
        });
        //console.log(productQuery)
    }

    //filter by color
    if (req.query.colors){
        productQuery = productQuery.find({
            colors:{$regex: req.query.colors, $options:'i'}
        });
    }

    //filter by size
    if (req.query.sizes){
        productQuery = productQuery.find({
            sizes:{$regex: req.query.sizes, $options:'i'}
        });
    }
    
    //filter by price range
    if (req.query.price){
        const priceRange = req.query.price.split("-")
        //gte:greater than or equal
        //lte: less than or equal
        productQuery = productQuery.find({
            price:{$gte: priceRange[0], $lte:priceRange[1]},
        })

    }
    //pagination
    
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

    //limit

    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 1;

    //startIndex
    const startIndex = (page-1) * limit

    //endIndex
    const endIndex= (page) * limit;

    //total
    const total = await Product.countDocuments()

    productQuery = productQuery.skip(startIndex).limit(limit);

    const pagination ={};

    if(endIndex<total){
        pagination.next ={
            page: page+1,
            limit,
        };
    }

    if(startIndex>0){
        pagination.prev={
            page: page -1,
            limit,
        };
    }

    //await the query
    const products = await productQuery.populate("reviews");

    res.json({
        status:"Success",
        total,
        results: products.length,
        pagination,
        message:"Products fetched succesfully",
        products
    })
});


// @desc Get single product
// @route GET /api/products/:id
// access Public
export const getProductCtrl = AsyncHandler(async(req,res)=>{
    console.log(req.params)
    const product = await Product.findById(req.params.id).populate("reviews");
    if(!product){
        throw new Error("Product not found")
    }
    res.json({
        status:'success',
        message:"Product fetched succesfully",
        product

    })
});



// @desc update product
// @route PUT /api/products/:id/update
// @access Private/Admin
export const updateProductCtrl = AsyncHandler(async(req,res)=>{
    const {name, description, category, sizes, colors, user, price, totalQty, brand} = req.body;

    //update
    const product =await Product.findByIdAndUpdate(req.params.id, {
        name, description, category, sizes, colors, user, price, totalQty, brand
    },
    {
        new: true,
    });
    res.json({
        status:'success',
        message:"Product updated succesfully",
        product

    })
});

// @desc delete product 
// @route DELETE /api/products/:id/delete
// @access Private/Admin
export const deleteProductCtrl = AsyncHandler(async(req,res)=>{
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({
        status:'success',
        message:"Product deleted succesfully",

    });
});


