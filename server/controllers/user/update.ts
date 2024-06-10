import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import cloudinary from "cloudinary";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import userModel from "../../models/user.model";
import ErrorHandler from "../../utils/errorHandler";
import { redis } from "../../utils/redis";
import { accessTokenOptions, refreshTokenOptions } from "../../utils/jwt";
import { updateUserRoleService } from "../../services/user.service";

// update user name and email info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });

        // if new email already exist then return error
        if (isEmailExist) {
          return next(new ErrorHandler("Email already exist", 400));
        }
        // updating the email
        user.email = email;
      }

      // name has no condition simply updating the name
      if (name && user) {
        user.name = name;
      }

      // saving the updated userdata
      await user?.save();
      // updating redis data
      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      // .select is used bcz we want to access password field of user as we set selecting password to false in user model
      const user = await userModel.findById(req.user?._id).select("+password");

      // if user is logged in using social auth then they cannot have password, thus cannot change it
      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;

      await user.save();
      await redis.set(req.user?._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update profile picture
interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;

      const user = await userModel.findById(userId);

      if (avatar && user) {
        // if avatar is present already
        if (user?.avatar?.public_id) {
          // delete that avatar
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          // set new avatar
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });

          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
        // if avatar is not set for the user
        else {
          // set the avatar
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });

          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      const user = await userModel.findById(userId);

      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

        user.avatar = {
          public_id: "",
          url: "",
        };
      }

      await user.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user role
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;

      updateUserRoleService(res, id, role);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update access token every 5 min
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
          expiresIn: "3d",
        }
      );

      // adding user to request
      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // expire in 7 days

      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
