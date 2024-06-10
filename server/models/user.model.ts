import mongoose, { Model, ObjectId, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const emailRegexPattern: RegExp =
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export interface IUser extends Document {
  isModified(arg0: string): unknown;
  _id: any;
  email: string;
  name: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<Boolean>;
  SignAccessToken: ()=>string;
  SignRefreshToken: ()=>string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      // required: [true, "Please enter your password"], removing this bcz during social authentication we don't need password
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// pre-save is mongoose hook which runs before a document is saved in database
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Sign access token when user log in
userSchema.methods.SignAccessToken = function(){
  return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN_SECRET || "", {
    expiresIn: "5m"
  })
}

// Sign refresh token
userSchema.methods.SignRefreshToken = function (){
  return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET || "", {
    expiresIn: "3d"
  });
}

// to compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
