import jwt from "jsonwebtoken"
export const getToken =async (userId) =>{
    try{
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not set")
        }
        const token = jwt.sign({userId} ,process.env.JWT_SECRET , {expiresIn:"7d"})
        console.log(token)
        return token

    }
    catch (error){
        console.log(error)
        throw error

    }

}