import express from "express";
import { editCourse, uploadCourse } from "../controllers/course/set.course";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getAllCourses, getAllCoursesByAdmin, getCourseByUser, getSingleCourse } from "../controllers/course/get.course";
import { addAnswer, addQuestion } from "../controllers/course/add.question";
import { addReplyToReview, addReview } from "../controllers/course/add.reviews";
import { deleteCourse } from "../controllers/course/delete.course";

const router = express.Router();

// courses
router.post("/create-course", isAuthenticated, authorizeRoles("admin"), uploadCourse);
router.put("/edit-course/:id", isAuthenticated, authorizeRoles("admin"), editCourse);
//everyone can see course details so no authentication
router.get("/course/:id", getSingleCourse);
router.get("/all-courses", getAllCourses);
router.get("/my-course/:id", isAuthenticated, getCourseByUser);

// questions
router.put("/add-question", isAuthenticated, addQuestion);
router.put("/add-answer", isAuthenticated, addAnswer);

// reviews
router.put("/add-review/:id", isAuthenticated, addReview);
router.put("/add-reply", isAuthenticated, authorizeRoles("admin"), addReplyToReview);

// admin
router.get("/all-courses-admin", isAuthenticated, authorizeRoles("admin"), getAllCoursesByAdmin);
router.delete("/delete-course/:id", isAuthenticated, authorizeRoles("admin"), deleteCourse);

export default router;