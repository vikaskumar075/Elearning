import { Response } from "express";
import courseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";

export const createCourse= CatchAsyncError(async(data: any, res: Response)=>{
    const course= await courseModel.create(data);

    res.status(201).json({
        success: true,
        course
    })
})

// get all users
export const getAllCoursesService = async (res: Response) => {
    const courses = await courseModel.find().sort({ createdAt: -1 });
  
    res.status(201).json({
      success: true,
      courses,
    });
  };
  