import {Request, Response, NextFunction} from "express";
import ErrorHandler from "../../utils/errorHandler";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import { generateLast12MonthData } from "../../utils/analytics.generator";
import userModel from "../../models/user.model";
import courseModel from "../../models/course.model";
import orderModel from "../../models/order.model";

// get user's analytics -- only for admin
export  const getUserAnalytics= CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const users= await generateLast12MonthData(userModel);

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// get course's analytics -- only for admin
export  const getCoursesAnalytics= CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const courses= await generateLast12MonthData(courseModel);

        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// get order's analytics -- only for admin
export  const getOrdersAnalytics= CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const orders= await generateLast12MonthData(orderModel);

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})