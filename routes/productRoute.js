import express from 'express';
import { createProductCtrl } from '../controllers/productCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { getProductsCtrl } from '../controllers/productCtrl.js';
import { getProductCtrl } from '../controllers/productCtrl.js';
import { updateProductCtrl } from '../controllers/productCtrl.js';
import { deleteProductCtrl } from '../controllers/productCtrl.js';
import isAdmin from "../middlewares/isAdmin.js";
import upload from "../config/fileUpload.js";

const productsRouter = express.Router();
productsRouter.post("/", isLoggedIn, isAdmin, upload.array("files"), createProductCtrl)   //array for multiple upload 
productsRouter.get("/allProducts", isLoggedIn, isAdmin, getProductsCtrl)
productsRouter.get("/:id", getProductCtrl)
productsRouter.put("/:id", isLoggedIn, isAdmin, updateProductCtrl);
productsRouter.delete("/:id/delete", isLoggedIn, isAdmin, deleteProductCtrl);
export default productsRouter;