import notificationModel from "../../models/notification.model";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";

// get all notifications ( only for admin );
export const getNotifications = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const notifications = await notificationModel.find().sort({createdAt: -1});

        res.status(201).json({
            success: true,
            notifications
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// update notification status --- only admin
export const updateNotification = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const notification = await notificationModel.findById(req.params.id);

        if(!notification){
            return next(new ErrorHandler("You have no notifications", 404));
        }
        else{
            notification.status = 'read';
        }
        await notification.save();

        const notifications = await notificationModel.find().sort({
            createdAt: -1
        });

        res.status(201).json({
            success: true,
            notifications
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})