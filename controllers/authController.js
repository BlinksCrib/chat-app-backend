import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

const register = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    throw new BadRequestError({
      msg: 'please provide all values',
      status: false,
    })
  }

  const usernameCheck = await User.findOne({ username })
  if (usernameCheck) {
    throw new BadRequestError({ msg: 'Username already used', status: false })
  }
  const emailCheck = await User.findOne({ email })
  if (emailCheck) {
    throw new BadRequestError({ msg: 'Email already used', status: false })
  }
  const user = await User.create({ username, email, password })

  res.status(StatusCodes.CREATED).json({
    status: true,
    user: {
      email: user.email,
      username: user.username,
    },
  })
}

const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    throw new BadRequestError({
      msg: 'please provide all values',
      status: false,
    })
  }

  const user = await User.findOne({ username })

  if (!user) {
    throw new UnAuthenticatedError({
      msg: 'Incorrect Username or Password',
      status: false,
    })
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError({
      msg: 'Incorrect Password',
      status: false,
    })
  }
  res.status(StatusCodes.OK).json({ status: true, user })
}

const getAllUsers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.params.id } }).select([
    'email',
    'username',
    'avatarImage',
    '_id',
  ])
  res.status(StatusCodes.OK).json({status:true,users})
}

const setAvatar = async (req, res) => {
  const userId = req.params.id
  const avatarImage = req.body.image
  const userData = await User.findByIdAndUpdate(
    userId,
    {
      isAvatarImageSet: true,
      avatarImage,
    },
    { new: true }
  )
  res.status(StatusCodes.OK).json({
    isSet: userData.isAvatarImageSet,
    image: userData.avatarImage,
  })
}

const logout = async (req, res) => {
  if (!req.params.id) return res.json({ msg: 'User id is required ' })
  onlineUsers.delete(req.params.id)
  return res.status(200).send()
}

export { register, login, getAllUsers, setAvatar, logout }
