import app from "./app";
import dotenv from "dotenv";
import { database } from "./utils/database";
import { cloudinaryConfig } from "./utils/cloudinary";

dotenv.config();

// connecting database
database();

// connecting cloudinary
cloudinaryConfig;

// create server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
