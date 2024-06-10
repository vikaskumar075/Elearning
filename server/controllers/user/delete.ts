import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import userModel from "../../models/user.model";
import ErrorHandler from "../../utils/errorHandler";
import { redis } from "../../utils/redis";

// delete user -- only for admin
export const deleteUser= CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params;

        const user= await userModel.findById(id);

        if(!user){
            return next(new ErrorHandler("User not found", 404));
        }

        await user.deleteOne({id});

        await redis.del(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})