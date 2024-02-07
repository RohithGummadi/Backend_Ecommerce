import mongoose from "mongoose";
const Schema  = mongoose.Schema;
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000+ Math.random()*9000)

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            type: Object,
            required: true
        },
    ],
    shippingAddress: {
        type: Object,
        required: true,
    },
    orderNumber: {
        type: String,
        default: randomTxt + randomNumbers
    },
    paymentStatus: {
        type: String,
        default: "Not Paid",
    },
    paymentMethod: {
        type: String,
        default: "Not specified",
    },
    currency: {
        type: String,
        default: "Not specified",
    },
    totalPrice: {
        type: Number,
        default: 0.0,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "processing", "shipped", "delivered"],
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
