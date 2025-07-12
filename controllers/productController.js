
import { v2 as cloudinary } from "cloudinary"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const addProduct = async (req, res) => {

    try {

        const { name, description, price, quantity, cartItems, orderItems } = req.body
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)
        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            }));

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                quantity: Number(quantity),
                images: imagesUrl,
                cartItems,
                orderItems
            }
        })

        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }



}


const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany()
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const productUpdate = async (req, res) => {
    try {

        const { id } = req.params;


        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided"
            });
        }


        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        })

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const updateProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: req.body
        })

        res.json({
            success: true,
            message: "Product updated successfully",
            product: updateProduct
        });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeProduct = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(req.body)
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        })

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const product = await prisma.product.delete({
            where:{ id : Number(id) }
        })

         res.json({
            success: true,
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
export { addProduct, getProducts, getProduct, productUpdate, removeProduct  }