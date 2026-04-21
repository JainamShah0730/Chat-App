import express from 'express'
import userControllers from '../controllers/userControllers.js'
const router = express.Router();

router.route('/').post(userControllers.registerUser)
router.post('/login',userControllers.authUser)

export default router