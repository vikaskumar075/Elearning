import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import courseModel from "../../models/course.model";
import ErrorHandler from "../../utils/errorHandler";
import { redis } from "../../utils/redis";


// delete course --only for admin
export const deleteCourse= CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params;

        const course= await courseModel.findById(id);

        if(!course){
            return next(new ErrorHandler("User not found", 404));
        }

        await course.deleteOne({id});

        await redis.del(id);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})