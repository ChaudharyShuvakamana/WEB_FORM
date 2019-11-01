const hbs=require("hbs");
const mongodb=require("mongodb");
const bodyParser=require("body-parser");
const express=require("express");
const app=express();
//mongodb
const MongoClient=mongodb.MongoClient;
const url="mongodb://localhost:27017"
const databaseName='shopping-app'
//if you need to use id for manipulating database

const ObjectID=mongodb.ObjectID;

const path=require("path");
app.set("view engine","hbs");

//to find the path for partial files
const partialPath=path.join(__dirname,'views/partials')
hbs.registerPartials(partialPath)

const dir = path.join(__dirname,"public");
app.use(express.static(dir))
app.use(bodyParser.urlencoded({exteneded:false}));


//to get the index hbs file
app.get("/",function(req,res){
    res.render("index");
}
)


//connect with database > connect methoud uses three parameters
MongoClient.connect(url,{useNewUrlParser:true},function(err,res){
    if(err)
    {
        return console.log("Database Connection Error!");
    }
    const db=res.db(databaseName);
//database related codes


//to get data from form
app.post('/insert-data', function(req,res){
    // console.log(req.body.firstname);
    db.collection('staffss').insertOne(req.body);
 })

 //to fetch data from the database

 app.get('/one',function(req,res){
     db.collection('staffss').find().toArray(function(err,mydata){
         //console.log(mydata);
         res.render('display',{people:mydata});
     })
 })


 //to get id and delete

 app.get('/delete/:id',function(req,res){
     var uid=req.params.id.toString();
     console.log(uid);
     db.collection('staffss').deleteOne({_id: new ObjectID(uid)});
     
 })

 //update
app.get('/update/:id',function(req,res){
    var uid=req.params.id.toString();
    db.collection('staffss').find({_id: new ObjectID(uid)}).toArray(function(err,mydata){
        //console.log(mydata);
        res.render('update',{people:mydata});
})

})
app.post('/edit',function(req,res){
    console.log(req.body);
    var vid= req.body.user_id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

      db.collection('staffss').updateOne({_id: new ObjectID(vid)}, {$set: {firstname : firstname, lastname:lastname }});
      res.redirect('/one')
  })


//db.collection('staff').updateOne({name:'haris'},{$set:{age:22}});
})


app.listen("3000");