import AsyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js"

//@desc create orders
//@route POST /api/v1/orders
//@access private

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
    //console.log(order);

    // //Update the product quantity
    // const products = await Product.find({_id:{$in:{orderItems}}})  //_ids in orderItems(this has multiple items)

    // orderItems?.map(async(order)=>{  //Here the id in order is product id, thats why we are comparing ===
    //     const product = products?.find((product)=>{
    //         return product?._id?.toString() === order?._id?.toString();
    //     });
    //     if (product){
    //         product.totalSold += order.qty
    //     }
    //     await product.save();
    // });
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

    //make payment(Stripe)
    //Payment webhook implementation
    //Update the user order
    res.json({
        success: true,
        message: "Order created",
        order,
        user
    })

});

//Order placment is completed 
 