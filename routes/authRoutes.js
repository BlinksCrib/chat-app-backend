import express from 'express';
const router = express.Router();

import {
  login,
  register,
  getAllUsers,
  setAvatar,
  logout,
} from '../controllers/authController.js'

router.post('/login', login)
router.post('/register', register)
router.get('/allusers/:id', getAllUsers)
router.post('/setavatar/:id', setAvatar)
router.get('/logout/:id', logout)

export default router;
