// npm modules
const express = require('express')

// local file
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()


// Parses incoming json from POST to object
app.use(express.json())
// Register routers
app.use(userRouter)
app.use(taskRouter)

module.exports = app