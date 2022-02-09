const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const MongoClient = mongo.MongoClient
dotenv.config();
const MongoUrl= 'mongodb+srv://shekhar:shekhar123@cluster0.pfjzw.mongodb.net/dummyd?retryWrites=true&w=majority'
const port = process.env.PORT || 2001
const nodemailer = require('nodemailer');
const multer  = require('multer')
var db;

app.use(cors())
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.get('/',(err,res)=>{
    res.send('Api working ..fine')
})

app.get('/tenant',(req,res)=>{
    var query = parseInt(req.query.user_id);
    // console.log(req);
    db.collection('Tenant').find({user_id:query}).toArray((err,result)=>{
        if (err) throw ('This API is not working')
        res.send(result)
    })
})

app.post('/addtenant',(req,res)=>{
    // console.log(req.body)
    db.collection('Tenant').insert(req.body,(err,result)=>{
        if(err) throw err;
        res.send('data inserted succesfully')
    })
})

app.get('/property',(req,res)=>{
    var query = parseInt(req.query.user_id);
    // console.log(query);
    db.collection('Property').find({user_id:query}).toArray((err,result)=>{
        if (err) throw ('This API is not working')
        res.send(result)
    })
})

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads')
    },
    filename:function(req,filename,cb){
        cb(null,Date.now()+filename.originalname)
    }
})
var upload = multer({storage:storage})


app.post('/addproperty',upload.single('files'),(req,res)=>{
    var file = req.file;
    console.log(file)
    var psotdata = {
        property_name:req.body.property_name,
        eastablish_date:req.body.eastablish_date,
        location:req.body.location,
        state:req.body.state,
        country:req.body.country,
        maintenance:req.body.maintenance,
        discription:req.body.discription,
        files:file.filename
    }
    db.collection('Property').insert(psotdata,(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

// delete perticular id
app.delete('/delete/id',(req,res) => {
    var id = parseInt(req.params._id)
    db.collection('Property').delete({_id:id})
    .then(res=>{
        res.status(200).json({
            message:'property deleted',
            result:res
        })
    })
      .catch(err=>{
          res.status(500).json({
              error:err
              
          })
          
      })
})

//update in perticular object
app.put('/updateproperty',(req,res)=>{
    var query= parseInt(req.query._id);  
    // console.log(query); 
    db.collection('Property').findOneAndUpdate({_id:query},{
        $set:{
            property_name:req.body.property_name,
            eastablish_date:req.body.eastablish_date,
            location:req.body.location,
            state:req.body.state,
            country:req.body.country,
            maintenance:req.body.maintenance,
            discription:req.body.discription
        }
    },(err,result)=>{
        if (err) throw err;
        res.send('data update successfully')
    })

})

app.get('/property/id',(req,res)=>{
    // console.log('testing');
    var query = parseInt(req.query.id);
    // console.log(query);
    db.collection('Property').find({id:query}).toArray((err,result)=>{
        if (err) throw ('This API is not working')
        res.send(result)
    })
})

app.post('/send_mail',(req,res)=>{
    // console.log(req.body)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'info.renthunt@gmail.com',
          pass: 'cuz123##'
        }
      });
      
      var mailOptions = {
        from: 'info.renthunt@gmail.com',
        to: req.body.to,
        subject:req.body.subject,
        text: req.body.message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.json({status: false, respMsg: error})
        } else {
          console.log('Email sent: ' + info.response);
        }
      }
      
      );
})

MongoClient.connect(MongoUrl,(err,client)=>{
    if (err) console.log('Not connecting');
    db=client.db('RentHunt')
})

app.listen(port,()=>{
    console.log(`localhost:${port}`)
})