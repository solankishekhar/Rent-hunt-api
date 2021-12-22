var express = require('express')
var app = express();
var cors = require('cors')
var dotenv = require('dotenv')
var mongo = require('mongodb')
var MongoClient = mongo.MongoClient
dotenv.config();
var MongoUrl= 'mongodb+srv://shekhar:shekhar123@cluster0.pfjzw.mongodb.net/dummyd?retryWrites=true&w=majority'
var port = process.env.PORT || 2001
var db;

app.use(cors())

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});




app.get('/',(err,res)=>{
    res.send('Api working ..fine')
})


app.get('/tenant',(req,res)=>{

    db.collection('Tenant').find().toArray((err,result)=>{
        if (err) throw ('This is API is not working')
        res.send(result)
    })
   
})

app.get('/property',(req,res)=>{
    db.collection('Property').find().toArray((err,result)=>{
        if (err) console.log('The property API is not working')
        res.send(result);
    })
})




MongoClient.connect(MongoUrl,(err,client)=>{
    if (err) console.log('Not connecting');
    db=client.db('RentHunt')
})



app.listen(port,()=>{
    console.log(`localhost:${port}`)
})