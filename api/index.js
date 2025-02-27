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
const port=process.env.PORT || 4000;
const jwtSecret='yugdjwheiudhkhfyego';
const multer=require('multer');
const fs=require('fs');
app.use(express.json());
app.use(cookieParser());
const Cart=require('./models/Cart.js')
const Place=require('./models/Places.js');
const Bookings=require('./models/Booking.js') // Make sure the path is correct
// cors use to connect the api through frontend by this
app.use(bodyParser.urlencoded({extended:true}))
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(cors({
 credentials: true,
    origin: "https://rental-web-frontend.onrender.com",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
app.post('/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
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
// Update


app.put('/profile/:id', async (req, res) => {
  const { token } = req.cookies;
  const { name, password } = req.body;
  const { id } = req.params;

  if (!token) {
      return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      try {
          const userdoc = await User.findById(id);

          if (!userdoc) {
              return res.status(404).json({ error: 'User not found' });
          }

          // Ensure that the logged-in user can only update their own profile
          if (user.id !== userdoc._id.toString()) {
              return res.status(403).json({ error: 'Forbidden: You cannot edit this profile.' });
          }

          // Update fields if provided
          if (name) userdoc.name = name;
          if (password) {
              const salt = await bcrypt.genSalt(10);
              userdoc.password = await bcrypt.hash(password, salt);
          }

          await userdoc.save();
          res.json({ message: 'Profile updated successfully', user: { id: userdoc._id, name: userdoc.name } });
      } catch (error) {
          console.error('Error updating profile:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
});

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
app.post('/bookings', async (req, res) => {
  const userData = await getuserdatafromtoken(req);
  const { place, checkin, checkout, maxguest, name, phone, price } = req.body;
    if(!userData){
      return res.status(400).json({ message: 'Please Login first for Booking..' });
    }
  // Validate that all required fields are present
  if (!place || !checkin || !checkout || !maxguest || !phone || !price || !name) {
    return res.status(400).json({ message: 'Fill all the details please' });
  }

  try {
    // Create a new booking
    const doc = await Bookings.create({
      place,
      checkin,
      checkout,
      maxguest,
      name,
      phone,
      price,
      user: userData.id,
    });

    // Send the created booking as the response
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.post('/cart', async (req, res) => {
  const userData = await getuserdatafromtoken(req);
  const { place } = req.body;
    if(!userData){
      return res.status(400).json({ message: 'Please Login first for Booking..' });
    }
  // Validate that all required fields are present
  if (!place) {
    return res.status(400).json({ message: 'Fill all the details please' });
  }

  try {
    // Create a new booking
    const doc = await Cart.create({
      place,
      user: userData.id,
    });

    // Send the created booking as the response
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


app.get('/bookings',async(req,res)=>{
 const userData = await getuserdatafromtoken(req);
res.json(await Bookings.find({user:userData.id}).populate('place'))
})

app.get('/cart',async(req,res)=>{
  const userData = await getuserdatafromtoken(req);
 res.json(await Cart.find({user:userData.id}).populate('place'))
 })
 app.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;

  try {
      // Find the item by ID and delete it
      const deletedItem = await Cart.findByIdAndDelete(id);

      if (!deletedItem) {
          return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ message: "Failed to remove item from cart" });
  }
});
app.delete('/places/:id', async (req, res) => {
  const { id } = req.params;

  try {
      // Find the item by ID and delete it
      const deletedItem = await Place.findByIdAndDelete(id);

      if (!deletedItem) {
          return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json({ message: "Item removed from Accomodation successfully" });
  } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ message: "Failed to remove item from accomodation" });
  }
});
app.get('/search',async(req,res)=>{
  try{
    const searchquery=req.query.q;
    if(!searchquery){
      const allPlace=await Place.find();
      return res.status(200).json(allPlace);
    }
    const placedou = await Place.find({
      address: { $regex: searchquery, $options: 'i' }
    });        
    res.status(200).json(placedou);
  }catch (err) {
    res.status(500).json({ message: 'Server error' });
}
})
// Route to get user (owner) details by owner id
app.get('/userdetails/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});

// Filter places by price range
app.post('/filterbyMoney', async (req, res) => {
  let { minPrice, maxPrice } = req.body;

  try {
    // Ensure prices are numbers (removing any '$' symbol just in case)
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);

    // Validate that minPrice and maxPrice are valid numbers
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ error: 'Invalid price values. Please provide valid numbers.' });
    }

    // Fetch places within the price range from the database
    const filteredPlaces = await Place.find({
      price: { $gte: minPrice, $lte: maxPrice }
    });
    // Return the filtered places
    res.status(200).json(filteredPlaces);

  } catch (error) {
    console.error('Error filtering by price:', error);
    res.status(500).json({ error: 'Server error while filtering by price' });
  }
});


app.post('/filterbyGuest', async (req, res) => {
  const { minGuest, maxGuest } = req.body;

  try {
    // Find places where maxguest falls within the given range
    const filteredGuest = await Place.find({
      maxguest: { $gte: minGuest, $lte: maxGuest }
    });

    // Return the filtered places
    res.json(filteredGuest);
  } catch (error) {
    console.error('Error filtering by guest count:', error); // Updated error message
    res.status(500).json({ error: 'Server error while filtering by guest count' }); // Updated error response
  }
});
app.post('/places/:id/like', async (req, res) => {
  const { id } = req.params;
  const { liked } = req.body;
    
  try {
      const place = await Place.findById(id);
      if (!place) {
          return res.status(404).json({ message: "Place not found" });
      }

      place.likes = liked ? place.likes + 1 : place.likes - 1;
      await place.save();

      res.json({ message: "Like updated successfully", likes: place.likes });
  } catch (error) {
      console.error("Error updating like:", error);
      res.status(500).json({ message: "Server error" });
  }
});

app.post('/places/:id/dislike', async (req, res) => {
  const { id } = req.params;
  const { disliked } = req.body;

  try {
      const place = await Place.findById(id);
      if (!place) {
          return res.status(404).json({ message: "Place not found" });
      }

      place.dislikes = disliked ? place.dislikes + 1 : place.dislikes - 1;
      await place.save();
      console.log(place);

      res.json({ message: "Dislike updated successfully", dislikes: place.dislikes });
  } catch (error) {
      console.error("Error updating dislike:", error);
      res.status(500).json({ message: "Server error" });
  }
});
app.post("/places/:id/comment", async (req, res) => {
  const userData = await getuserdatafromtoken(req);
  const { id } = req.params;
  const { text } = req.body;

  if (!userData) {
    return res.status(401).json({ error: "Please log in to comment." });
  }

  if (!text) {
    return res.status(400).json({ error: "Comment cannot be empty." });
  }

  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: "Place not found." });
    }

    const newComment = {
      user: userData.id,
      text,
      timestamp: new Date()
    };

    place.comments.push(newComment);
    await place.save();

    res.json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});
app.get("/places/:id/comments", async (req, res) => {
  const userData = await getuserdatafromtoken(req);
  try {
    console.log("Request Params:", req.params);

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid place ID." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid place ID format." });
    }


    
    const place = await Place.findById(id).populate("comments.user", "name email");
    
    console.log("Fetched place:", place);

    if (!place) {
      return res.status(404).json({ error: "Place not found." });
    }

    res.json(place.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: error.message }); // Send exact error message to frontend
  }
});

app.listen(4000,() => {
  console.log('http://localhost:4000')
});
