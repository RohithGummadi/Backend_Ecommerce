import Express from "express";
import {createReviewCtrl} from "../controllers/reviewsCtrl.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const reviewRouter = Express.Router();
reviewRouter.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewRouter;

