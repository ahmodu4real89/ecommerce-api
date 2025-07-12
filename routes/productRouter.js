import express from "express"
import { addProduct, getProducts, getProduct, productUpdate, removeProduct} from "../controllers/productController.js"
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";

const productRouter = express.Router()

productRouter.post(
    '/add',adminAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    addProduct
);

productRouter.get("/list", getProducts  )
productRouter.get("/list/:id", getProduct)
productRouter.put("/update/:id",  productUpdate )
productRouter.delete("/remove/:id",  removeProduct )

export default productRouter;