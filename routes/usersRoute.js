import express from 'express';
import { registerUserCtrl, loginUserCtrl, getUserProfile, updateShippingAddressctrl} from '../controllers/usersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post('/login', loginUserCtrl);
userRoutes.get('/profile', isLoggedIn, getUserProfile);
userRoutes.put('/update/shipping', isLoggedIn, updateShippingAddressctrl);



export default userRoutes;