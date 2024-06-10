import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import layoutModel from "../../models/layout.model";
import cloudinary from "cloudinary";

// create layout --- only by admin
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      // check if layout for that type already exists
      const isTypeExists = await layoutModel.findOne({ type });
      if (isTypeExists) {
        return next(new ErrorHandler(`${type} already exist`, 400));
      }

      if (type === "Banner") {
        // create banner
        const { image, title, subTitle } = req.body;

        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await layoutModel.create(banner);
      }

      else if (type === "FAQ") {
        const { faq } = req.body;
        console.log(faq);

        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        // console.log(faqItems);

        await layoutModel.create({
          type: "FAQ",
          faq: faqItems,
        });
      }

      else if (type === "Categories") {
        const { categories } = req.body;
        console.log(categories);

        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await layoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
      }

      else{
        return next(new ErrorHandler(`You cannot create ${type} type layout!`, 400));
      }
      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit layout --- only by admin
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (type === "Banner") {
        // check if banner image is already present
        const bannerData: any = await layoutModel.findOne({ type: "Banner" });

        if (bannerData)
          await cloudinary.v2.uploader.destroy(bannerData.image.public_id);

        const { image, title, subTitle } = req.body;

        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        const banner = {
            type: "Banner",
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await layoutModel.findByIdAndUpdate(bannerData?._id, {banner});
      }

      else if (type === "FAQ") {
        const { faq } = req.body;
        const savedFaq= await layoutModel.findOne({type: "FAQ"});

        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );

        await layoutModel.findByIdAndUpdate(savedFaq?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }

      else if (type === "Categories") {
        const { categories } = req.body;
        const savedCategories= await layoutModel.findOne({type : "Categories"});

        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await layoutModel.findByIdAndUpdate(savedCategories?._id,{
          type: "Categories",
          categories: categoriesItems,
        });
      }
      else{
        return next(new ErrorHandler("No such type exists!", 400));
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// get layout by type
export const getLayoutByType = CatchAsyncError(async(req: Request, res : Response, next : NextFunction)=>{
    try {
        const {type} = req.body;
        const layout = await layoutModel.findOne({type});
        res.status(201).json({
            success: true,
            layout
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500)); 
    }
})