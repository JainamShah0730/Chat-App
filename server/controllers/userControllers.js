import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js'
import generateToken from '../config/generateToken.js'


const registerUser = asyncHandler(async (req,res) => {
   const { name , email , password , pic } = req.body

   if(!name || !email || !password){
      res.status(400)
      throw new Error("Please Enter all the fields")
   }

   const userExists = await User.findOne({ email})

   if(userExists){
      res.status(400);
      throw new Error('User already exists')
   }

   const user = await User.create({
      name,
      email,
      password,
      pic,
   })

   if(user){
      res.status(201).json({
         _id: user._id,
         name: user.name,
         email:user.email,
         pic: user.pic,
         token:generateToken(user._id),

      })

   }else {
      res.status(400);
      throw new Error("User not Found");
   }
})

const authUser = asyncHandler(async (req,res) => {
   const {email, password} = req.body

   const user = await User.findOne({email})
   if(user && (await user.matchPassword(password))){
      res.json({
          _id: user._id,
         name: user.name,
         email:user.email,
         pic: user.pic,
         token:generateToken(user._id),

      })
   }else {
      res.status(401);
      throw new Error("Invalid Email 0r Password");
   }
})

export default  {registerUser, authUser}