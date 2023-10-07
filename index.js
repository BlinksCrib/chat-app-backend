import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import cors from 'cors'

import http from 'http'

import { Server } from 'socket.io'

const server = http.createServer(app)

// production
// import helmet from 'helmet/index.cjs'

// local
// import helmet from 'helmet'
// const helmet = require('helmet')
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

// db and authenticateUser
import connectDB from './db/connect.js'

// routers
import authRouter from './routes/authRoutes.js'

// user router
import messagesRouter from './routes/messagesRoutes.js'

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import { authenticateUser } from './middleware/authentication.js'

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// only when ready to deploy

app.set('trust proxy', 1)
app.use(express.json({ limit: '50mb' }))
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb' }))

// app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://chit-chats.netlify.app'],
    credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify the allowed HTTP methods
    // allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  })
)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/messages', messagesRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)

    // Attach Socket.IO to the existing HTTP server
    const io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173', 'https://chit-chats.netlify.app'],
        credentials: true,
      },
    })

    global.onlineUsers = new Map()
    io.on('connection', (socket) => {
      global.chatSocket = socket
      socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id)
      })

      socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit('msg-recieve', data.msg)
        }
      })
    })

    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
