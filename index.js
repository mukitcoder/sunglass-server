const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fch2j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db('sunglass_pro');
      const purchaseCollection = database.collection('purchase');
      const productsCollection = database.collection('products')
      const usersCollection = database.collection('users')



      // add products to DB
      app.post('/addProducts', async(req, res)=>{
        const result = await productsCollection.insertOne(req.body)
        res.send(result)
      })
        // post purchase info to DB
        app.post('/purchase', async(req, res)=>{
            const purchases = req.body
            const result = await purchaseCollection.insertOne(purchases)
            res.json(result)
        })
        // users info
        app.post('/users', async(req, res)=>{
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.json(result)
        })

        app.put('/users', async(req, res)=>{
            const user = req.body
            const filter = {email:user.email}
            const options = {upsert:true}
            const updateDoc = {$set:user}
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        // for make admin
        app.put('/users/admin', async(req, res)=>{
            const user = req.body
            const filter = {email:user.email}
            const updateDoc = {$set:{role:'admin'}}
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        //get all products from db
        app.get('/allProducts', async(req, res)=>{
          const result = await productsCollection.find({}).toArray()
          res.send(result)
        })

        // get purchase info from DB
        app.get('/purchase', async (req, res)=>{
            const email = req.query.email
            const query = {email:email}
            const cursor = purchaseCollection.find(query)
            const orders = await cursor.toArray()
            res.json(orders)
        })

        // for check admin to get access in UI
        app.get('/users/:email', async(req, res)=>{
          const email = req.params.email
          const query = {email:email}
          const user = await usersCollection.findOne(query)
          let isAdmin = false
          if(user?.role === 'admin'){
              isAdmin = true
          }
          res.json({admin:isAdmin})
        })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from sunglass World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})