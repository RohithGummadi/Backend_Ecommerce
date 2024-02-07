import User from "../models/User.js";
import bcrypt from "bcryptjs"
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

//@desc Register User
//@Route POST /api/v1/users/register
//@access Private/Admin

export const registerUserCtrl = asyncHandler (async(req,res)=>{
    const {fullname, email, password} = req.body;
    //check if user existes 
    const userExists = await User.findOne({email});  //here we give the email object 
    if(userExists){
        throw new Error("User already exists")
    }

    //hash password
    const salt = await bcrypt.genSalt(10);  //adding randomness, 10 in the computational work required to hash the password. Highes the cost more computation
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({  //create user
        fullname,
        email,
        password: hashedPassword,
    });
    res.status(201).json({
        status: "Success",
        message: "User Registered Succesfully",
        data:user,
    })
});


// @desc Login user
// @route POST /api/v1/users/login
// @access Public
// export const loginUserCtrl = async(req,res)=>{
//     const {email, password}  =req.body;

//     //find user in db only using email 
//     const userFound = await User.findOne({
//         email,
//         });

//     if(userFound && await bcrypt.compare(password, userFound.password)){
//         res.json({
//             status:"Success",
//             msg: "User Succesfully LoggedIn",
//             userFound
//         })

//     } else{
//         res.json({
//             msg: "Invalid Login"
//         })
//     }
// }

export const loginUserCtrl = asyncHandler(async(req,res)=>{
    const {email, password}  =req.body;

    //find user in db only using email 
    const userFound = await User.findOne({
        email,
        });
    if(userFound && await bcrypt.compare(password, userFound.password)){
        res.json({
            status:"Success",
            msg: "User Succesfully LoggedIn",
            userFound,
            token:generateToken(userFound?._id),
        })

    } else{
        throw new Error("Invalid Login Credentials")
    }
}
);


//@desc Get user profile
//@route GET /api/v1/users/profile
//@access Private
export const getUserProfile = asyncHandler(async(req,res)=>{
    const token = getTokenFromHeader(req)
    //verify token
    const verified = verifyToken(token);
    console.log(verified)
    res.json(
        {
            msg: "Welcome to profile page"
        });
});

//@desc Update user shipping address
//@route PUT /api/v1/users/update/shipping
//@access Private


export const updateShippingAddressctrl = asyncHandler(async(req,res)=>{
   const {firstName, lastName, address, city, postalCode, province, phone} = req.body;
   const user  = await User.findByIdAndUpdate(req.userAuthId, {
    shippingAddress:{
        firstName, 
        lastName, 
        address, 
        city, 
        postalCode, 
        province, 
        phone
    },
    hasShippingAddress: true
   },
   {
    new:true
   }
   );
   res.json({
    status:"success",
    message:"User shipping address updated succesfully",
    user,
   });

})
