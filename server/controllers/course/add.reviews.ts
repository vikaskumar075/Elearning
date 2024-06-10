import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import courseModel from "../../models/course.model";


interface IAddReviewData{
    review: string;
    rating: number;
    userId: string;
}

export const addReview= CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const userCourseList= req.user?.courses;

        const courseId =  req.params.id;

        //check if courseId exist in user course list based on _id
        const courseExists = userCourseList?.some((course: any)=> course._id.toString() === courseId.toString());

        if(!courseExists){
            return next(new ErrorHandler("You are not eligible to access this course", 404));
        }

        const course= await courseModel.findById(courseId);
        const {review, rating}= req.body as IAddReviewData;

        const reviewData: any= {
            user: req.user,
            comment: review, 
            rating,
        }

        course?.reviews.push(reviewData);

        let avg= 0;
        course?.reviews.forEach((rev: any)=>{
            avg+=rev.rating;
        })

        if(course) course.ratings = avg / course?.reviews.length;

        await course?.save();

        const notification = {
            title: "New Review Recieved",
            message: `${req.user?.name} has given a review in ${course?.name} course`,
        }

        // create notification

        res.status(200).json({
            success: true, 
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// add reply to review
interface IAddReviewReplyData{
    comment: string;
    courseId: string;
    reviewId: string;
}
export const addReplyToReview = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {comment, courseId, reviewId} = req.body as IAddReviewReplyData;

        const course= await courseModel.findById(courseId);

        if(!course){
            return next(new ErrorHandler("Course not found", 404));
        }

        const review = course?.reviews?.find((rev: any)=>rev._id.toString() === reviewId);

        if(!review){
            return next(new ErrorHandler("Review not found", 404));
        }

        const replyData: any= {
            user: req.user,
            comment
        }

        if(!review.commentReplies){
            review.commentReplies = [];
        }
        review.commentReplies.push(replyData);

        await course.save();

        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})