import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const addCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body
        const cart = await prisma.cartItem.upsert({
            where: {
                userId_productId: { userId, productId }
            },
            update: {
                quantity: { increment: quantity }
            },
            create: {
                userId,
                productId,
                quantity
            }
        })
        res.json({ success: true, message: cart })
    } catch (error) {
        console.log(error)
        res.json({ message: false, message: error.message })
    }
};

const getOrderItem = async (req, res) => {

    try {
        const orderItems = await prisma.orderItem.findMany({
            include: {
                order: {
                    select: {
                        id: true,
                        createdAt: true,
                        total: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }

        })
        res.json({ success: false, message: orderItems })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const checkOut = async (req, res) => {
    try {
        const { userId } = req.body

        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        })


        if (cartItems.length === 0) {
            return res.json({ success: false, message: "Your cart is empty. Please add items before checkout." })
        }

        let total = 0;
        const orderItemsData = cartItems.map(item => {
            const productPrice = item.product?.price
            const lineTotal = item.quantity * productPrice
            total += lineTotal
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price
            }
        })

        const order = await prisma.order.create({
            data: {
                userId,
                total,
                items: {
                    create: orderItemsData
                }
            }
        })

        for (const item of cartItems) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { quantity: { decrement: item.quantity } }
            })
        }


        await prisma.cartItem.deleteMany({ where: { userId } })

        res.json({ success: true, message: order })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
};


const getCartItem = async (req, res) => {
    try {

        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }

        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        price: true,
                        quantity: true,
                        name: true
                    }
                }
            }
        })
        res.json({ success: true, message: cartItems })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })

    }
};

const removeCartById = async (req, res) => {
    try {
        const { id } = req.body

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: Number(id) }
        })
        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" })
        };

        await prisma.cartItem.delete({
            where: { id: Number(id) }
        })

        res.json({ success: true, message: `Cart item ${id} deleted successfully` })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const removeAllCartItem = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId in request." })
        }

         const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        })


        if (cartItems.length === 0) {
            return res.json({ success: false, message: "Your product cart is empty." })
        }

        await prisma.cartItem.deleteMany({
            where: { userId }
        })

        res.json({ success: true, message: `All cart items deleted.` })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}



export { addCart, checkOut, getCartItem, getOrderItem, removeCartById, removeAllCartItem }