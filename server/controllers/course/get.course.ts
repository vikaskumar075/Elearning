import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import courseModel from "../../models/course.model";
import ErrorHandler from "../../utils/errorHandler";
import { redis } from "../../utils/redis";
import { getAllCoursesService } from "../../services/course.service";

// to get single course details
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        // .select("-x") means not fetching x from database
        const course = await courseModel
          .findById(courseId)
          .select(
            "-courseData.videoUrl -courseData.suggestion, -courseData.questions -courseData.links"
          );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // auto expire in 7 days

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// to get all courses
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");

      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);

        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await courseModel
          .find()
          .select(
            "-courseData.videoUrl -courseData.suggestion, -courseData.questions -courseData.links"
          );

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course content - only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not allowed to access this course", 404)
        );
      }

      const course = await courseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses (by admin)

export const getAllCoursesByAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
