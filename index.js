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
// post purchase info to DB
        app.post('/purchase', async(req, res)=>{
            const purchases = req.body
            const result = await purchaseCollection.insertOne(purchases)
            console.log(result);
            res.json(result)
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