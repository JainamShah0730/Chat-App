import express from 'express'
import userControllers from '../controllers/userControllers.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.route('/').post(userControllers.registerUser).get(protect, userControllers.allUsers)
router.post('/login',userControllers.authUser)


export default router