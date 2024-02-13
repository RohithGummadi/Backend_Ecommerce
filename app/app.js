import dotenv from 'dotenv';
import express from 'express';
import userRoutes from '../routes/usersRoute.js';
import dbConnect from '../config/dbConnect.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productsRouter from '../routes/productRoute.js';
import categoriesRouter from '../routes/categoriesRouter.js';
import brandsRouter from '../routes/brandsRouter.js';
import colorRouter from '../routes/colorRouter.js';
import reviewRouter from '../routes/reviewRouter.js';
import orderRouter from '../routes/ordersRouter.js';
import Stripe from 'stripe';
import couponsRouter from '../routes/couponsRouter.js';

dotenv.config();
import Order from '../models/Order.js';

dbConnect();

const app = express();

//Test stripe:
const stripe = new Stripe(process.env.STRIPE_KEY);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_063e3de3f6bb157aef013ee2640f2c08a94b1fb4c48c0a24793aa0f54e4b24f6";

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    //console.log("event")
  } catch (err) {
      console.log('err', err.message)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

if (event.type === "checkout.session.completed"){
  //UPDATE THE ORDER
  const session = event.data.object
  //console.log(session)
  const orderID = JSON.parse(session.metadata.orderId);
  const paymentStatus= session.payment_status;
  const paymentMethod = session.payment_method_types[0];
  const totalAmount = session.amount_total;
  const currency = session.currency;

  //find order
  const order = await Order.findByIdAndUpdate(orderID,{
    totalPrice: totalAmount / 100,
    currency, 
    paymentMethod,
    paymentStatus
  },
  {
    new: true
  });
  console.log(order)

} else {
  return;
}
  response.send();
});

app.use(express.json());

//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/coupons/", couponsRouter);

//err middlewares
app.use(notFound);
app.use(globalErrHandler);



export default app;
