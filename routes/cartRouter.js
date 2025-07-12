
import express from "express"
import {addCart, checkOut, getCartItem,  getOrderItem,  removeCartById, removeAllCartItem } from "../controllers/cartController.js"

const cartRouter = express.Router()


cartRouter.post('/add', addCart) 
cartRouter.post("/checkout", checkOut)
cartRouter.get("/items", getCartItem)
cartRouter.get("/orderItem", getOrderItem)
cartRouter.delete('/cartById', removeCartById)
cartRouter.delete("/removeAll", removeAllCartItem)
export default cartRouter;