import jwt from "jsonwebtoken";
const isAuth =async (req,res,next) => 
{
    try {
        let { token } = req.cookies;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is not found"
            })
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not set"
            })
        }
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!verifyToken) {
            return res.status(400).json({message:"user doesn't have valid token"})

        }
        req.userId = verifyToken.userId;
        req.user = verifyToken.userId;
        next();

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }


}
export default isAuth;