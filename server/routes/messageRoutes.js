import express from 'express'
import { sendMessage } from '../controllers/messageController'

const router = express.Router()

router.route('/').post(protect,sendMessage)
// router.route('/:chatId').get(protect,allMessage)

export default router