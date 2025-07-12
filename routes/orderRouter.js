
import express from "express"
import { getAOrderById, getAllOrder,  deleteOrderById,  } from "../controllers/orderController.js"

const orderRouter = express.Router()

orderRouter.get("/order", getAOrderById)
orderRouter.get("/allOrder", getAllOrder)
orderRouter.delete("/orderById", deleteOrderById)

export default orderRouter;