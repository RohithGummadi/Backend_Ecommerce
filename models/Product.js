import mongoose from "mongoose";
const Schema = mongoose.Schema

const ProductSchema = new Schema (
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,

        },
        brand:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            ref:"Category",
            required: true
        },
        sizes:{
            type:[String],
            enum:["S", "M", "L", "XL", "XXL"],
            required:true,
        },
        colors:{
            type:[String],
            required: true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        },
        images:[
            {
            type:String,
            required: true
            },
        ],
        reviews:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Review",
            },

        ],
        price:{
            type:Number,
            ref:"Review"
        },
        totalQty:{
            type:Number,
            required:true
        },
        totalSold:{
            type:Number,
            required:true,
            default:0,
        },

    },
    {
        timestamps: true,
        toJSON:{virtuals:true},
    }
);
// Virtuals

//Quantity left
ProductSchema.virtual("qtyleft").get(function(){
    const product = this
    return product.totalQty - product.totalSold;
});

// Total rating
ProductSchema.virtual("totalReviews").get(function(){
    //console.log(this) // we ge the instance of the object
    const product = this;
    return product?.reviews?.length
})
//average rating
ProductSchema.virtual("averageRating").get(function(){
    let ratingsTotal = 0;
    const product  = this
    product?.reviews.forEach((review)=>{
        ratingsTotal += review?.rating
    });
    //calc average rating
    const averageRating = ratingsTotal / product?.reviews?.length
    return averageRating;
})
const Product  =  mongoose.model("Product", ProductSchema);

export default Product;