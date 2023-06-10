const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/productModel')
const app = express();

app.use(express.urlencoded({extended:false}))
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.send('Sending response to the user using send funtion')
})

app.get('/blog', (req, res) => 
{
    res.send('This is a blog page and u used /blog in the url bro..')
})

app.get('/products', async (req, res) =>
{
    const products = await Product.find({}); 
    try{
        res.status(200).json(products);
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

app.get('/products/:id', async (req, res) =>
{
    const {id} = req.params;
    const product = await Product.findById(id); 
    try{
        res.status(200).json(product);
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

// update a data in database

app.put('/products/:id', async (req, res) =>
{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body); 
    try{
        if(!product)
        {
            return res.status(404).json({message: `Cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

app.delete('/products/:id', async (req, res) =>
{
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id,req.body); 
    try{
        if(!product)
        {
            return res.status(404).json({message: `Cannot find any product with ID ${id}`})
        }
        res.status(200).json(product);
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})


app.post('/products', async (req,res) => {
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product);
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).json({message: error.message})
    }
})


mongoose.set("strictQuery",false)
mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('connected to MongoDB')
    app.listen(3000, () => {
        console.log(`Node API app is running on port 3000`);
    });
}).catch(() => {
    console.log(error)
})