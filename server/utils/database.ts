import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const url:string = process.env.MONGO_URL || "";

export const database=async () => {
    try {
        await mongoose.connect(url).then((data: any)=>{
            console.log(`Database connected with ${data.connection.host}`);
        })
    } catch (error: any) {
        console.log(error.message);
        setTimeout(database, 5000);
    }
}