import express from "express";
import {createOrderCtrl} from "../controllers/orderCtrl.js"
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import { getAllordersCtrl, getSingleOrderCtrl, updateOrderCtrl } from "../controllers/orderCtrl.js";

const orderRouter  = express.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllordersCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl)

export default orderRouter;
