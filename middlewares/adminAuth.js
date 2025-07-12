import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        
        if (!authHeader) {
            return res.json({
                success: false,
                message: "Not Authorized, Login Again"
            });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.json({
                success: false,
                message: "Invalid Authorization format"
            });
        }

        const token = parts[1];
        

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({
                success: false,
                message: "Invalid token credentials"
            });
        }

        next();
    } catch (error) {
        console.error("JWT error:", error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
