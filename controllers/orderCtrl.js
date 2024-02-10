import AsyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js"
import { rmdirSync } from "fs";

//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe Instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = AsyncHandler(async(req,res)=>{

    //Get Payload
    const {orderItems, shippingAddress, totalPrice} = req.body;
    //console.log(orderItems, shippingAddress, totalPrice);
    //Find the user
    const user = await User.findById(req.userAuthId);
    //Check if the user has shipping address
    if(!user?.hasShippingAddress){
        throw new Error("Please provide shipping address");

    }
    //Check if the order is not empty
    if(orderItems?.length<=0){
        throw new Error("No error Items")
    }
    //Place/create order - save into DB
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice,
    })
    // Update the product quantity
    const productIds = orderItems.map(order => order._id);
    const products = await Product.find({ _id: { $in: productIds } });

    await Promise.all(
    orderItems.map(async (order) => {
        const product = products?.find((product) => {
        return product?._id?.toString() === order?._id?.toString();
        });

        if (product) {
        product.totalSold += order.qty;
        await product.save();
        } else {
        throw new Error(`Product not found for order item with id: ${order._id}`);
        }
    })
    );
    
    //push order into user
    user?.orders.push(order?._id);
    await user.save();

    //Stripe: Test
    const convertedOrders = orderItems.map((item)=>{

        return {  //stripe need individual item objects
            price_data:{
                currency:"usd",
                product_data:{
                    name: item?.name,
                    description: item?.description,    
                },
                unit_amount: item?.price*100,
            },
            quantity: item?.qty,
            };
    
        });
    
    const session = await stripe.checkout.sessions.create({
        line_items:convertedOrders,
        metadata:{
        orderId : JSON.stringify(order?._id) //Stripe need data in strings so  stringify  
        },
        mode:"payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });
    res.send({url:session.url});
});

//@desc get all orders
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = AsyncHandler(async(req,res)=>{
    //find all order
    const orders = await Order.find();
    res.json({
        success: true,
        message: "All orders",
        orders
    })

})

//@Fetching Single Order

export const getSingleOrderCtrl = AsyncHandler(async(req,res)=>{
    const order  = await Order.findById(req.params.id);
    res.json({
        success: true,
        message: "Single Order",
        order
    })
})

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin


export const updateOrderCtrl = AsyncHandler(async(req,res)=>{
    const id  = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(id,
    {
        status: req.body.status,
    },
    {
        new: true
    });
    res.status(200).json({
        success: true,
        message: "Order Updated",
        updatedOrder
    })
});

