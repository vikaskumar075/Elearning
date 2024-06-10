import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import { redis } from "../../utils/redis";

export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      // to delete user data from redis
      const userId = req.user?._id || "";
      await redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
