import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET)
// };

const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const userRegister = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const emailExist = await prisma.user.findUnique({ where: { email } })
        if (emailExist) {
            res.json({ success: false, message: "User alrerady exist" })
        };

        if (!validator.isEmail(email)) {
            res.json({ success: false, message: "Please enter valid email" })
        };

        if (password.length < 8) {
            res.json({ success: false, message: "Please enter password up to 8 character" })
        };
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const newUser = await prisma.user.create({
            data: { name, email, password: hashPassword }
        })

        const token = createToken(newUser.id)
        res.json({ success: true, newUser, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }


}

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = createToken({ userId: user.id })
        res.json({ token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }


}

const getAllUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        res.json({ success: true, users })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentiial" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



export { userRegister, loginUser, adminLogin, getAllUser }