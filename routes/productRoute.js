import express from 'express';
import { createProductCtrl } from '../controllers/productCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { getProductsCtrl } from '../controllers/productCtrl.js';
import { getProductCtrl } from '../controllers/productCtrl.js';
import { updateProductCtrl } from '../controllers/productCtrl.js';
import { deleteProductCtrl } from '../controllers/productCtrl.js';
import upload from "../config/fileUpload.js";

const productsRouter = express.Router();
productsRouter.post("/", isLoggedIn, upload.array("files"), createProductCtrl)   //array for multiple upload 
productsRouter.get("/allProducts", getProductsCtrl)
productsRouter.get("/:id", getProductCtrl)
productsRouter.put("/:id", isLoggedIn, updateProductCtrl);
productsRouter.delete("/:id/delete", isLoggedIn, deleteProductCtrl);
export default productsRouter;