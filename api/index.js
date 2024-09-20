const express=require('express');
const cors=require('cors');
const path = require('path');
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt=require('bcryptjs');
const User=require('./models/User.js');
const bycrptSalt=bcrypt.genSaltSync(10);
const jwt=require('jsonwebtoken');
const imageDownloader=require('image-downloader');
require('dotenv').config();
const app=express();
const cookieParser=require('cookie-parser');
const port=4000;
const jwtSecret='yugdjwheiudhkhfyego';
const multer=require('multer');
const fs=require('fs');
app.use(express.json());
app.use(cookieParser());
const Place=require('./models/Places.js');
const Bookings=require('./models/Booking.js') // Make sure the path is correct
// cors use to connect the api through frontend by this
app.use(bodyParser.urlencoded({extended:true}))
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173',
}));

function ConnectToDb(){
  try {
    mongoose.connect(process.env.MONGO_URL);
    
    console.log("Mongo connected");
  } catch (error) {
    console.log("Mongo not connected")
  }
}
ConnectToDb();
function getuserdatafromtoken(req){
  return new Promise((resolve,reject)=>{
    jwt.verify(req.cookies.token,jwtSecret,{},async(err,user)=>{
     if(err) throw err;
     resolve(user);
    });
  });
}
app.get("/test",(req,res)=>{
   res.json('test ok');

});
app.post('/register', async(req, res) =>{
   const { name, email, password } = req.body;

   try{
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bycrptSalt),
  }); 
  // console.log(userDoc);
  res.json({userDoc});
   } catch(e){
  // console.log(e);
    res.status(422).json(e);
   }
});
app.post('/login', async(req, res) =>{
  const {email, password } = req.body;
  // console.log(email);
   const userDoc=await User.findOne({email});
  //  console.log(userDoc);
   if(userDoc){
    const passok=bcrypt.compareSync(password,userDoc.password);
    // console.log(passok);
    if(passok){
      const token = jwt.sign({name:userDoc.name,email:userDoc.email, id:userDoc._id}, jwtSecret,{ expiresIn: '1d' })
      res.cookie('token',token);
      console.log(token);
      res.json("pass ok");
    }
    else{
      res.status(422).json("pass not ok");
    }
   }else{

    res.json('not found');
   } 
});
app.get('/profile',(req,res)=>{
  const {token}=req.cookies;
  console.log(token);
  if(token){
    jwt.verify(token,jwtSecret, async(err,user)=>{
      if(err) throw err;
      const {name,email,_id}=await User.findById(user.id);
      res.json({name,email,_id});
    });
  }
  
  // res.json({token});
})
// For logout
app.post('/logout',(req,res)=>{
  res.cookie('token','').json(true);
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder to store the files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });
app.post('/upload', upload.array('photos', 10), (req, res) => {
  const uploadedFiles = req.files.map(file => file.filename);
  res.json(uploadedFiles);
});


// Handling image by link (upload-by-link)
app.post('/upload-by-link', async (req, res) => {
  const { Link } = req.body;
  const filename = Date.now() + '.jpg';
  const filePath = path.join(__dirname, 'uploads', filename);

  const response = await axios({
      url: Link,
      method: 'GET',
      responseType: 'stream',
  });

  response.data.pipe(fs.createWriteStream(filePath))
      .on('finish', () => {
          res.json(filename);
      })
      .on('error', (error) => {
          console.error('Error downloading image:', error);
          res.status(500).json({ error: 'Failed to download image' });
      });
});
app.get('/getimg/:filename', (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, 'uploads', filename);
  res.sendFile(file);
});

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const { title, address, addedPhotos, description, perks, extraInfo, checkin, checkout, maxguest,price } = req.body;
  jwt.verify(token, jwtSecret, async (err, user) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const placeDoc = await Place.create({
        owner: user.id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkin,
        checkout,
        maxguest,
        price,
      }); 
      console.log('Saving place:', { title, address, addedPhotos, description, perks, extraInfo, checkin, checkout, maxguest });
      res.json(placeDoc);
    } catch (error) {
      console.error('Error saving place:', error);
      res.status(500).json({ error: 'Failed to save place' });
    }
  });
});
app.get('/user-places',(req,res)=>{
  const {token}=req.cookies;
  jwt.verify(token,jwtSecret,{},async(err,user)=>{
    const {id}=user;
    res.json(await Place.find({owner:id}));
  })
})
app.get('/places/:id',async (req,res)=>{
const {id}=req.params;
res.json(await Place.findById(id));
})
app.put('/places/:id',async(req,res)=>{
  const { token } = req.cookies;
  const { 
   id, title, address, addedPhotos, description,
     perks, extraInfo, checkin, checkout,
      maxguest,price } = req.body;
      jwt.verify(token,jwtSecret,{},async(err,user)=>{
        const placedoc=await Place.findById(id);
        if(user.id===placedoc.owner.toString()){ // need for toString such tht it return true 
          console.log('Updating photos:', addedPhotos);
          console.log({price});
          placedoc.set({
  title,address,addedPhotos,description,
  perks,extraInfo,checkin,checkout,maxguest,price,
});
   await placedoc.save();
    res.json("ok");
        }
      });
})
app.get('/places',async(req,res)=>{
  res.json(await Place.find())
})
app.post('/bookings',async(req,res)=>{
  const userData=await getuserdatafromtoken(req);
  const{place,checkin,checkout,
    maxguest,name,phone,price}=req.body;
  Bookings.create({
    place,checkin,checkout,
    maxguest,name,phone,price,
    user:userData.id,
  }).then((doc)=>{
   res.json(doc);
  }).catch((err)=>{
    console.log(err);
    throw err;
  })
})

app.get('/bookings',async(req,res)=>{
 const userData = await getuserdatafromtoken(req);
res.json(await Bookings.find({user:userData.id}).populate('place'))
 
})
app.listen(4000,() => {
  console.log('http://localhost:4000')
});
// 5BtZOM0hBU1JMcRE // mongo password