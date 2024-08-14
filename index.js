const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId,  } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000 ;


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udy85xl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const productCollection = client.db("productDB").collection('products')
    const categoryCollection = client.db("productDB").collection('categories')
    const cartCollection = client.db("productDB").collection('carts')

    app.post('/products',async(req,res) =>{
        const product = req.body ;
        const result = await productCollection.insertOne(product)
        res.send(result)
    })

    app.get('/products/:category',async(req,res) =>{
        const category = {category : req.params.category}
        const result = await productCollection.find(category).toArray()
        res.send(result)
   })


   app.get('/products',async(req,res)=>{
    const result = await productCollection.find().toArray()
    res.send(result)
   })

   app.get('/product/:id',async(req,res) =>{
      const id = req.params.id ;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
   })

   app.put('/products/:id',async(req,res) =>{
    const id = req.params.id ;
    const product = req.body ;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert : true}
    const updateProduct = {
        $set:{
            name : product.name,
            category : product.category,
            price : product.price,
            rating : product.rating,
            details : product.details,
            photo : product.photo
        }
    }
    const result = await productCollection.updateOne(filter,updateProduct,options)
    res.send(result)
   })

    app.get('/categories',async(req,res) =>{
        const result = await categoryCollection.find().toArray()
        res.send(result)
    })

    app.post('/cart',async(req,res) =>{
        const cart = req.body ;
        const result = await cartCollection.insertOne(cart)
        res.send(result)
    })

    app.get('/cart/:email',async(req,res) =>{
        const email = req.params.email ;
        const query = {email: email}
        const result = await cartCollection.find(query).toArray()
        res.send(result)
    })

    app.delete('/cart/:id',async(req,res) =>{
        const id = req.params.id ;
        const query = {_id:new ObjectId(id)}
        const result = await cartCollection.deleteOne(query)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('noboruba is running')
})


app.listen(port,()=>{
    console.log(`server port ${port}`)
})