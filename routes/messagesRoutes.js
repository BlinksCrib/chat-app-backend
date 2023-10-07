import express from 'express'
const router = express.Router()

import { addMessage, getMessages } from '../controllers/messageController.js'

router.post('/addmsg', addMessage)
router.post('/getmsg', getMessages)

export default router
