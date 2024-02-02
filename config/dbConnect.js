import mongoose from "mongoose"

const dbConnect = async()=> {
    try {
        const connected = await mongoose.connect(process.env.Mongo_URL)   //process is a global Node.js object that provides information about, and control over, the current Node.js process. 
        console.log(`MongoDB connected ${connected.connection.host}`)
    }
    
    catch(error) {
        
        console.log(`Error connecting to ${error.message}`)
        process.exit(1);
    }
}

export default dbConnect;

//mongodb+srv://rohith:12345@ecommerce.5ymsgrh.mongodb.net/?retryWrites=true&w=majority

//mongodb+srv://rohith:<password>@ecommerce.5ymsgrh.mongodb.net/

//project : Backend_Ecommerce
//DB: Ecommerce