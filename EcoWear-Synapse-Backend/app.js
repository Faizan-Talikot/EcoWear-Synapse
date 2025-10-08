const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require("mongoose");
app.use(express.json());
const jwt = require('jsonwebtoken')
app.use(express.json());
app.use(require('cors')());

// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

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

const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  brand: String,
  isPaid: Boolean,
  score: Number,
  price: Number,
  category: String, // "jeans", "shirt", etc.
  description: String,
  imageUrl: String,
});

const ItemData = mongoose.model("ItemDatas", itemSchema, "ItemDatas");



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



app.get("/jeans", async (req, res) => {
  try {
    const jeansData = await ItemData.find({ category: "jeans" }).sort({ isPaid: -1 });
    res.json(jeansData);
  } catch (error) {
    console.error("Error fetching jeans data", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/tshirts", async (req, res) => {
  try {
    const tshirtData = await ItemData.find({ category: "tshirt" }).sort({ isPaid: -1 });
    res.json(tshirtData);
  } catch (error) {
    console.error("Error fetching tshirt data", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/hoodies", async (req, res) => {
  try {
    const hoodieData = await ItemData.find({ category: "hoodie" }).sort({ isPaid: -1 });
    res.json(hoodieData);
  } catch (error) {
    console.error("Error fetching hoodie data", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/dresses", async (req, res) => {
  try {
    const dressData = await ItemData.find({ category: "dress" }).sort({ isPaid: -1 });
    res.json(dressData);
  } catch (error) {
    console.error("Error fetching dress data", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /items/:id - Get single item by ID
// Assuming you're using an Express route
app.get("/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params;
    
    // Fetch item by category and id
    const item = await ItemData.findOne({ category: category, id: id }); // Ensure `category` field is in your schema

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get("/shirts", async (req, res) => {
  try {
    // Fetch shirt data with category "shirt", sorted by isPaid (paid first)
    const shirtData = await ItemData.find({ category: "shirt" }).sort({ isPaid: -1 });
    res.json(shirtData); // Return sorted shirt data
  } catch (error) {
    console.error("Error fetching shirt data", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Endpoint for Tshirts
app.get("/tshirts", async (req, res) => {
  try {
    const tshirtData = await ItemData.find({ category: "tshirt" }).sort({ isPaid: -1 });
    res.json(tshirtData);
  } catch (error) {
    console.error("Error fetching tshirt data", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Endpoint for hoodies
app.get("/hoodies", async (req, res) => {
  try {
    const hoodieData = await ItemData.find({ category: "hoodie" }).sort({ isPaid: -1 });
    res.json(hoodieData);
  } catch (error) {
    console.error("Error fetching Hoodie data", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Endpoint for dress
app.get("/Dresses", async (req, res) => {
  try {
    const dressData = await ItemData.find({ category: "dress" }).sort({ isPaid: -1 });
    res.json(dressData);
  } catch (error) {
    console.error("Error fetching Dress data", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Items for Catalog
app.get("/items", async (req, res) => {
  try {
    const items = await ItemData.find().sort({ isPaid: -1 }); // Paid first
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error" });
  }
});


const questionSchema = new mongoose.Schema({
  name: String,
  question: String,
  itemId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Question = mongoose.model('Question', questionSchema);



// Example Express.js
app.post('/questions', async (req, res) => {
  const { name, question, itemId } = req.body;
  if (!name || !question || !itemId) return res.status(400).send("Missing fields");

  // Save in DB (MongoDB, Firebase, etc.)
  const newQuestion = await Question.create({ name, question, itemId, createdAt: new Date() });
  res.status(201).json({ success: true, message: "Question submitted", data: newQuestion });
});



const reviewSchema = new mongoose.Schema({
  itemId: { type: String, required: true },       // Which product
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

// POST: Add a new review
app.post('/reviews', async (req, res) => {
  try {
    const { itemId, userName, rating, comment } = req.body;

    if (!itemId || !userName || !rating) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const review = await Review.create({ itemId, userName, rating, comment });
    res.status(201).json({ success: true, message: 'Review added', data: review });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Search API
app.get('/search', async (req, res) => {
  // console.log('Search endpoint called with req.query:', req.query);
  try {
    const query = req.query.q?.toLowerCase() || '';
    // console.log('Processed query:', query);

    if (!query) {
      // console.log('No query provided, returning empty array');
      return res.json([]);
    }

    const filtered = await ItemData.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });
    // console.log('Search results:', filtered);
    res.json(filtered);
  } catch (error) {
    // console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Get all reviews for an item
app.get('/:itemId', async (req, res) => {
  try {
    console.log("item called")
    const reviews = await Review.find({ itemId: req.params.itemId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Node js server started on port ${PORT}`);
});
