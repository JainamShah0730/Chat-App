
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
            // Don't log full auth headers or tokens (sensitive).
            // Extract token silently and only log non-sensitive identifiers.
            token = req.headers.authorization.split(" ")[1]

            if (!token || token.includes("{{") || token.split('.').length !== 3) {
                res.status(401)
                throw new Error("Invalid auth token: token is malformed or placeholder value")
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // Log only the user id to aid debugging without exposing secrets
            console.log("Authenticated user id:", decoded.id)
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