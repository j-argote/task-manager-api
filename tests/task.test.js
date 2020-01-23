const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, 
    userOne, 
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/db')

// jest life cycle method to run code before each test case
beforeEach(setupDatabase)


test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    // Assert that task was created in database
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should not create task with invalid description/completed', async () => {
    await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'houston'
    })
    .expect(400)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should fetch user task by id', async () => {
    await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
}) 

test('Should not fetch user task by id if unauthorized', async () => {
    await request(app)
    .get(`/tasks/${taskOne._id}`)
    .expect(401)
})

test('Should not fetch other users task by id', async () => {
    await request(app)
    .get(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(404)
})

test('Should fetch only completed tasks', async () => {
    const response = await request(app)
    .get('/tasks/?completed=true')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

    // Assert that only completed were fetched
    expect(response.body.length).toEqual(1)
})

test('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
    .get('/tasks/?completed=false')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    expect(200)

    // Assert that only incomplete tasks were fetched
    expect(response.body.length).toEqual(1)
})

test('Should sort tasks by description/completed/createdAt/updatedAt', async () => {
    const response = await request(app)
    .get('/tasks/?sortBy=createdAt_desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

    // Assert tasks fetched are sorted
    expect(response.body[0].description).toEqual(taskTwo.description)
})

test('Should fetch page of tasks', async () => {
    const response = await request(app)
    .get('/tasks/?limit=1&skip=1')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

    // Assert tasks fetched by page
    expect(response.body[0]._id.toString()).toEqual(taskTwo._id.toString())
})

test('Should not update task with invalid description/completed', async () => {
    await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'houston'
    })
    .expect(400)
})

test('Should not update other users task', async () => {
    const response = await request(app)
    .patch(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'Go to store'
    })
    .expect(404)

    // Assert task did not get updated in database
    const task = await Task.findById(response.body._id)
    expect(task).toBeNull()
})

test('Should delete user task', async () => {
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    // Assert task was deleted from database
    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    // Assert the task is still in the database
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should not delete task if unauthenticated', async () => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
})

