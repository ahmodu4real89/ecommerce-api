import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getAOrderById = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order does not exist" });
        }

        const order = await prisma.order.findUnique({
            where: {id: orderId },
            include: {
                items: {
                    select: {
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
        });

        res.json({ success: true, message: order});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllOrder = async(req, res)=>{
    try {
        const allOrder = await prisma.order.findMany({
              include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }

        })
        res.json({success:true, message:allOrder})
    } catch (error) {
         console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteOrderById = async (req, res) =>{
    try {
        const {id} = req.body
        const existingOrder = await prisma.order.findUnique({
             where: { id: Number(id) },
            include: { items: true }
        })  
        
          if (!existingOrder) {
            return res.status(404).json({ success: false, message: "Order not found" })
        };

           await prisma.orderItem.deleteMany({
            where: { orderId: Number(id) }
        })

        await prisma.order.delete({
              where: { id: Number(id) },
    
        })

         res.json({ success: true, message: `Order ${id} deleted successfully` })
        
    } catch (error) {
         console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


export { getAOrderById, getAllOrder,  deleteOrderById }