import { Request, Response, NextFunction } from "express";
import userModel from "../../models/user.model";
import ErrorHandler from "../../utils/errorHandler";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import { sendToken } from "../../utils/jwt";
import { getAllUsersService, getUserByID } from "../../services/user.service";

interface ILoginUser {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginUser;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// to get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      getUserByID(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// to log in by social authorization
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });

      if (!user) {
        const newUser = await userModel.create({
          email,
          name,
          avatar,
        });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users by admin
export const getAllUsersByAdmin= CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
  try {
    getAllUsersService(res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})