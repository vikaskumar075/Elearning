import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order/order";


const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);

// by admin
orderRouter.get("/all-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

export default orderRouter;