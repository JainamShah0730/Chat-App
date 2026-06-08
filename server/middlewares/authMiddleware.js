
import jwt from 'jsonwebtoken'
import User from "../Models/userModel.js"
import asyncHandler from "express-async-handler"

const protect = asyncHandler(async (req, res , next) => {
    let token 

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
        try{
            console.log("AUTH HEADER:", req.headers.authorization)
            token = req.headers.authorization.split(" ")[1]
            console.log("EXTRACTED TOKEN:", token)

            if (!token || token.includes("{{") || token.split('.').length !== 3) {
                res.status(401)
                throw new Error("Invalid auth token: token is malformed or placeholder value")
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log("DECODED JWT:", decoded)
            req.user = await User.findById(decoded.id).select("-password")
            next()
        } catch (error) {
            console.error("Auth middleware error:", error)
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    }

    if(!token) {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})
 
export { protect }