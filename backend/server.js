const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')
dotenv.config()
let todos = [];
// console.log(process.env.MONGO_URI)

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'TODO_list';
app.use(bodyparser.json())
app.use(cors())

client.connect();

// get all the items
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('documents');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// save all the items
app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('documents');
    const findResult = await collection.insertOne(password)
    res.send({ success: true, result: findResult })
})

// delete all the items
app.delete('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('documents');
    const findResult = await collection.deleteOne(password)
    res.send({ success: true, result: findResult })
})

// change something in item
app.put('/:id', async (req, res) => {
    const id = req.params.id;
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('documents');
    
    const findResult = await collection.updateOne({ id: id }, { $set: password })
    res.send({ success: true, result: findResult })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})