const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require("mongoose");
app.use(express.json());
const jwt = require('jsonwebtoken')
app.use(express.json());
app.use(require('cors')());

const mongoUrl = "mongodb+srv://sankalpsingh563:admin@cluster0.fxw83.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "SECRETKEY"
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

require('./UserDetails');

const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "started" });
});

app.get('/register', (req, res) => {
  res.send({ status: "register endpoint ready" });
});

/////////////////////////////////////////////////////////////////////////////////////////
const barcodeDataSchema = new mongoose.Schema({
  fabric: String,
  barcode_id: String,
  sustainability_score: String,
  sustainability_details:String,
  details: {
    fabric_type_impact: String,
    brand_sustainability_rating: String,
    carbon_footprint: String,
    water_usage: String,
    certifications_labels: String,
    recycling_disposal: String,
    alternative_suggestions: String
  }
});
const BarcodeData = mongoose.model("barcodedatas", barcodeDataSchema);


const scanHistorySchema = new mongoose.Schema({
  userEmail: String, // link to user by email
  type: String,
  barcode_id: String,
  score: Number,
  ecoFriendly: Boolean,
  date: {
    type: Date,
    default: Date.now
  }
});

const ScanHistory = mongoose.model('ScanHistory', scanHistorySchema);


const jeansSchema = new mongoose.Schema({
  id: Number,
  name: String,
  brand: String,
  isPaid: Boolean,
  score: Number,
  price: Number,
  description: String,
  imageUrl: String,
});

const JeansData = mongoose.model("JeansDatas", jeansSchema, "JeansDatas");


const ShirtSchema = new mongoose.Schema({
  id: Number,
  name: String,
  brand: String,
  isPaid: Boolean,
  score: Number,
  price: Number,
  description: String,
  imageUrl: String,
});

const ShirtData = mongoose.model("ShirtDatas", ShirtSchema, "ShirtDatas");

//////////////////////////////////////////////////////////////////////////////////////////

// Endpoint to fetch data based on barcode_id
app.get('/api/barcode-data/:barcode_id', async (req, res) => {
  console.log("barcode api called")
  const { barcode_id } = req.params; // Extract barcode_id from URL params

  try {
    const data = await BarcodeData.findOne({ barcode_id: barcode_id });
    if (!data) {
      return res.status(404).send({ status: "error", message: "Barcode not found" });
    }
    res.json(data); // Send the barcode data back to the frontend
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
});




//register
app.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send({ data: "User already exists!" });
  }

  try {
    await User.create({
      name: name,
      email: email,
      mobile: mobile,
      password: password,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "Error", data: error });
  }
});

//for login
app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name: name, password: password });
  if (user) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    return res.status(200).send({ status: "ok", data: token }); // ✅ success
  } else {
    return res.status(401).send({ status: "error", data: "Invalid credentials" }); // ❌ invalid
  }
});


app.post("/userdata", async(req,res) =>{
  const {token} = req.body;
  try{
    const user = jwt.verify(token,JWT_SECRET);
    const userEmail = user.email;

    User.findOne({email: userEmail}).then((data)=>{
      return res.send({status:"ok",data:data})
    });
  }catch(error){
    return res.send({error:error})
  }
})

// Add a scan
app.post('/add', async (req, res) => {
  const { user,type, barcode_id, score, ecoFriendly } = req.body;
  console.log("History POST received:", req.body);
  try {
    const newScan = new ScanHistory({
      userEmail: user,
      type,
      barcode_id,
      score,
      ecoFriendly
    });
    await newScan.save();
    res.status(201).json({ message: 'Scan saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save scan' });
  }
});

// Endpoint: Get user history
app.post('/get-history', async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ status: 'error', message: 'User required' });
  }

  try {
    const history = await ScanHistory.find({ userEmail: user }).sort({ date: -1 });
    return res.json({ status: 'ok', data: history });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch history' });
  }
});

//delete user history
app.post('/clear-history', async (req, res) => {
  const { user } = req.body;

  try {
    await ScanHistory.deleteMany({ userEmail: user });
    res.json({ status: 'ok', message: 'History cleared successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to delete history' });
  }
});

// const jeansData =[
//   {
//     "id": "1",
//     "name": "Slim Fit Jeans",
//     "brand": "EcoWear",
//     "isPaid": true,
//     "score": 50,
//     "price": 1884,
//     "description": "High-quality slim-fit jeans for everyday wear. Perfect for casual outings or a day at the office.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205601_jgkqtf"
//   },
//   {
//     "id": "2",
//     "name": "High Waist Jeans",
//     "brand": "EarthStyle",
//     "isPaid": true,
//     "score": 50,
//     "price": 2064,
//     "description": "Comfortable and trendy high-waist jeans. Ideal for pairing with tucked-in shirts and blouses.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205428_bzrhrq"
//   },
//   {
//     "id": "3",
//     "name": "Bootcut Jeans",
//     "brand": "EcoWear",
//     "isPaid": true,
//     "score": 50,
//     "price": 2122,
//     "description": "Classic bootcut jeans with a slight flare at the bottom. Perfect for a more relaxed fit.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205516_cixp2h"
//   },
//   {
//     "id": "4",
//     "name": "Distressed Denim Jeans",
//     "brand": "EarthStyle",
//     "isPaid": true,
//     "score": 50,
//     "price": 1519,
//     "description": "Fashion-forward distressed denim with a relaxed fit. Adds an edge to your casual look.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205542_m1hymn"
//   },
//   {
//     "id": "5",
//     "name": "Skinny Fit Jeans",
//     "brand": "NatureShades",
//     "isPaid": true,
//     "score": 50,
//     "price": 1485,
//     "description": "Sleek and comfortable skinny jeans with just the right amount of stretch for all-day wear.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205642_jtya8a"
//   },
//   {
//     "id": "6",
//     "name": "Relaxed Fit Jeans",
//     "brand": "NatureShades",
//     "isPaid": true,
//     "score": 50,
//     "price": 1572,
//     "description": "Casual and comfortable relaxed-fit jeans that provide ample room for movement.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205404_kdlqfb"
//   },
//   {
//     "id": "7",
//     "name": "Boyfriend Jeans",
//     "brand": "EarthStyle",
//     "isPaid": true,
//     "score": 50,
//     "price": 2061,
//     "description": "Loose and comfy boyfriend jeans with a cuffed hem for a laid-back, stylish vibe.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205229_kmzgtf"
//   },
//   {
//     "id": "8",
//     "name": "Straight Leg Jeans",
//     "brand": "NatureShades",
//     "isPaid": true,
//     "score": 50,
//     "price": 1568,
//     "description": "Timeless straight-leg jeans with a clean fit. Perfect for any casual or semi-formal occasion.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205441_pznjx9"
//   },
//   {
//     "id": "9",
//     "name": "Wide Leg Jeans",
//     "brand": "EarthStyle",
//     "isPaid": true,
//     "score": 50,
//     "price": 1548,
//     "description": "Trendy wide-leg jeans with a flattering silhouette. A must-have for relaxed, casual days.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205345_jfsigk"
//   },
//   {
//     "id": "10",
//     "name": "Cargo Jeans",
//     "brand": "GreenDenim",
//     "isPaid": true,
//     "score": 50,
//     "price": 1722,
//     "description": "Durable cargo jeans with multiple pockets for added functionality and style.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck"
//   },
//   {
//     "id": "11",
//     "name": "Bootcut Jeans",
//     "brand": "NatureShades",
//     "isPaid": true,
//     "score": 50,
//     "price": 1813,
//     "description": "Classic bootcut jeans offering a comfortable fit with a slightly flared leg.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205601_jgkqtf"
//   },
//   {
//     "id": "12",
//     "name": "Straight Leg Jeans",
//     "brand": "GreenDenim",
//     "isPaid": true,
//     "score": 50,
//     "price": 1799,
//     "description": "Timeless straight leg jeans that provide a sleek and relaxed fit.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205428_bzrhrq"
//   },
//   {
//     "id": "13",
//     "name": "Distressed Jeans",
//     "brand": "GreenDenim",
//     "isPaid": true,
//     "score": 50,
//     "price": 1560,
//     "description": "Edgy distressed jeans with rips and frays for a bold streetwear look.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205516_cixp2h"
//   },
//   {
//     "id": "14",
//     "name": "Skinny Fit Jeans",
//     "brand": "GreenDenim",
//     "isPaid": true,
//     "score": 50,
//     "price": 1358,
//     "description": "Sleek skinny fit jeans with a snug fit through the leg for a modern style.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205542_m1hymn"
//   },
//   {
//     "id": "15",
//     "name": "Slim Fit Stretch Jeans",
//     "brand": "GreenDenim",
//     "isPaid": true,
//     "score": 50,
//     "price": 1891,
//     "description": "Stretchy slim fit jeans that offer both comfort and style.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205642_jtya8a"
//   },
//   {
//     "id": "16",
//     "name": "Relaxed Fit Jeans",
//     "brand": "GreenDenim",
//     "isPaid": true,
//     "score": 50,
//     "price": 1946,
//     "description": "Relaxed fit jeans with extra room through the hips and thighs for ultimate comfort.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205404_kdlqfb"
//   },
//   {
//     "id": "17",
//     "name": "High Rise Skinny Jeans",
//     "brand": "EcoWear",
//     "isPaid": true,
//     "score": 50,
//     "price": 1421,
//     "description": "High-rise skinny jeans designed to elongate the legs and accentuate curves.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205229_kmzgtf"
//   },
//   {
//     "id": "18",
//     "name": "Vintage Wash Jeans",
//     "brand": "GreenDenim",
//     "isPaid": true,
//     "score": 50,
//     "price": 1571,
//     "description": "Retro-inspired vintage wash jeans with a worn-in, lived-in look.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205441_pznjx9"
//   },
//   {
//     "id": "19",
//     "name": "Slim Bootcut Jeans",
//     "brand": "GreenDenim",
//     "isPaid": true,
//     "score": 50,
//     "price": 1422,
//     "description": "Slim bootcut jeans that combine a contemporary fit with classic styling.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205345_jfsigk"
//   },
//   {
//     "id": "20",
//     "name": "Cargo Jogger Jeans",
//     "brand": "EcoWear",
//     "isPaid": true,
//     "score": 50,
//     "price": 1794,
//     "description": "Casual cargo jogger jeans with an elastic cuff and multiple utility pockets.",
//     "imageUrl": "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck"
//   }
// ]



app.get("/jeans",async (req, res) => {
  try {
    // Fetch data from MongoDB
    const jeansData = await JeansData.find();
    res.json(jeansData); // Return jeans data
  } catch (error) {
    console.error("Error fetching jeans data", error);
    res.status(500).json({ message: "Server error" });
  }
});

// const shirtsData = [
//   {
//     id: "1",
//     name: "Classic White Shirt",
//     brand: "EcoWear",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "A timeless white shirt for every occasion.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "2",
//     name: "Denim Shirt",
//     brand: "GreenDenim",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Rugged denim shirt with a comfortable fit.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "3",
//     name: "Classic Oxford Shirt",
//     brand: "ConsciousThreads",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Timeless Oxford shirt perfect for formal and casual wear.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "4",
//     name: "Linen Breeze Shirt",
//     brand: "GreenShades",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Lightweight linen shirt ideal for summer days.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "5",
//     name: "Slim Fit Formal Shirt",
//     brand: "EcoWear",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Sharp slim-fit shirt for office and events.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "6",
//     name: "Flannel Checked Shirt",
//     brand: "ReGen Style",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Soft flannel shirt with a bold checkered pattern.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "7",
//     name: "Mandarin Collar Shirt",
//     brand: "BambooBlend",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Trendy Mandarin collar design for a modern touch.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "8",
//     name: "Short Sleeve Casual Shirt",
//     brand: "ConsciousThreads",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Easygoing short sleeve shirt for everyday wear.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "9",
//     name: "Vertical Striped Shirt",
//     brand: "GreenShades",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Stylish vertical stripes for a sleek silhouette.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "10",
//     name: "Corduroy Button-Up",
//     brand: "EcoWear",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Soft corduroy fabric adds texture and style.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "11",
//     name: "Printed Resort Shirt",
//     brand: "TropicEthics",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Relaxed shirt with tropical vibes and prints.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "12",
//     name: "Classic Plaid Shirt",
//     brand: "GreenDenim",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Casual plaid shirt made for layering or solo wear.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "13",
//     name: "Sustainable Bamboo Shirt",
//     brand: "BambooBlend",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Eco-conscious shirt crafted from bamboo fiber.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "14",
//     name: "Minimalist White Shirt",
//     brand: "BioBlend",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Crisp white shirt with a clean minimalist look.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "15",
//     name: "Earth-Tone Khaki Shirt",
//     brand: "EcoWear",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Khaki colorway perfect for nature-inspired outfits.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "16",
//     name: "Dual Pocket Utility Shirt",
//     brand: "GreenUtility",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Functional and fashionable with dual chest pockets.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "17",
//     name: "Oversized Street Shirt",
//     brand: "ReGen Style",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Loose fit for that trendy streetwear aesthetic.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "18",
//     name: "Mandala Print Shirt",
//     brand: "TropicEthics",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Intricate mandala patterns bring spiritual flair.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "19",
//     name: "Vintage Washed Shirt",
//     brand: "RetroRoots",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Vintage washed finish gives it a retro feel.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "20",
//     name: "Henley Long Sleeve Shirt",
//     brand: "GreenShades",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Versatile Henley with a soft, lived-in feel.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "21",
//     name: "EcoBlend Everyday Shirt",
//     brand: "EcoBlend",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Everyday shirt made from a sustainable fabric blend.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   },
//   {
//     id: "22",
//     name: "Chambray Blue Shirt",
//     brand: "ConsciousThreads",
//     isPaid: true,
//     score: 50,
//     price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
//     description: "Soft chambray fabric in a breezy blue shade.",
//     imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
//   }
// ];


app.get("/shirts", async(req, res) => {
  try {
    // Fetch data from MongoDB
    const Shirt = await ShirtData.find();
    res.json(Shirt); // Return jeans data
  } catch (error) {
    console.error("Error fetching jeans data", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5001, () => {
  console.log("Node js server started.");
});


