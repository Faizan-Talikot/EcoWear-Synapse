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

const jeansData = [
  {
    id: "1",
    name: "Slim Fit Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "High-quality slim-fit jeans for everyday wear. Perfect for casual outings or a day at the office.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205601_jgkqtf",
  },
  {
    id: "2",
    name: "High Waist Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Comfortable and trendy high-waist jeans. Ideal for pairing with tucked-in shirts and blouses.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205428_bzrhrq",
  },
  {
    id: "3",
    name: "Bootcut Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Classic bootcut jeans with a slight flare at the bottom. Perfect for a more relaxed fit.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205516_cixp2h",
  },
  {
    id: "4",
    name: "Distressed Denim Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Fashion-forward distressed denim with a relaxed fit. Adds an edge to your casual look.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205542_m1hymn",
  },
  {
    id: "5",
    name: "Skinny Fit Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Sleek and comfortable skinny jeans with just the right amount of stretch for all-day wear.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205642_jtya8a",
  },
  {
    id: "6",
    name: "Relaxed Fit Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Casual and comfortable relaxed-fit jeans that provide ample room for movement.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205404_kdlqfb",
  },
  {
    id: "7",
    name: "Boyfriend Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Loose and comfy boyfriend jeans with a cuffed hem for a laid-back, stylish vibe.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205229_kmzgtf",
  },
  {
    id: "8",
    name: "Straight Leg Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Timeless straight-leg jeans with a clean fit. Perfect for any casual or semi-formal occasion.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205441_pznjx9",
  },
  {
    id: "9",
    name: "Wide Leg Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Trendy wide-leg jeans with a flattering silhouette. A must-have for relaxed, casual days.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205345_jfsigk",
  },
  {
    id: "10",
    name: "Cargo Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200, // Random price between 1200 and 3000
    description: "Durable cargo jeans with multiple pockets for added functionality and style.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
  },
  {
    id: "11",
    name: "Bootcut Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Classic bootcut jeans offering a comfortable fit with a slightly flared leg.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205601_jgkqtf",
  },
  {
    id: "12",
    name: "Straight Leg Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Timeless straight leg jeans that provide a sleek and relaxed fit.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205428_bzrhrq",
  },
  {
    id: "13",
    name: "Distressed Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Edgy distressed jeans with rips and frays for a bold streetwear look.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205516_cixp2h",
  },
  {
    id: "14",
    name: "Skinny Fit Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Sleek skinny fit jeans with a snug fit through the leg for a modern style.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205542_m1hymn",
  },
  {
    id: "15",
    name: "Slim Fit Stretch Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Stretchy slim fit jeans that offer both comfort and style.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205642_jtya8a",
  },
  {
    id: "16",
    name: "Relaxed Fit Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Relaxed fit jeans with extra room through the hips and thighs for ultimate comfort.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205404_kdlqfb",
  },
  {
    id: "17",
    name: "High Rise Skinny Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "High-rise skinny jeans designed to elongate the legs and accentuate curves.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205229_kmzgtf",
  },
  {
    id: "18",
    name: "Vintage Wash Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Retro-inspired vintage wash jeans with a worn-in, lived-in look.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205441_pznjx9",
  },
  {
    id: "19",
    name: "Slim Bootcut Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Slim bootcut jeans that combine a contemporary fit with classic styling.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205345_jfsigk",
  },
  {
    id: "20",
    name: "Cargo Jogger Jeans",
    price: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
    description: "Casual cargo jogger jeans with an elastic cuff and multiple utility pockets.",
    imageUrl: "https://res.cloudinary.com/dpaws88pp/image/upload/v12345678/Screenshot_2025-04-11_205322_ud8dck",
  },
];


app.get("/api/jeans", (req, res) => {
  res.json(jeansData); // Return jeans data
});

app.listen(5001, () => {
  console.log("Node js server started.");
});


