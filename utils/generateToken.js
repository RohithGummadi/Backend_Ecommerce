import Jwt from "jsonwebtoken";

const generateToken =(id)=>{
    return Jwt.sign({id}, process.env.JWT_KEY, {expiresIn:"3d"});  
};

export default generateToken;

