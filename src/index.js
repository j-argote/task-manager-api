// npm modules
const express = require('express')

// local file
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// Parses incoming json from POST to object
app.use(express.json())
// Register routers
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})