import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { accessChat } from '../controllers/chatController.js';
import { fetchChats } from '../controllers/chatController.js';
import { createGroupChat } from '../controllers/chatController.js';

const router = express.Router();

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat)
// router.route("/rename").put(protect, renameGroupChat)
// router.route("/groupremove").put(protect, removeUserFromGroup)
// router.route("/groupadd").put(protect, addUsersToGroup)




export default router;