const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require("mongoose");
app.use(express.json());
const jwt = require('jsonwebtoken')

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
const BarcodeData = mongoose.model("BarcodeData", barcodeDataSchema);

// Endpoint to fetch BarcodeData
app.get('/api/barcode-data', async (req, res) => {
  try {
    const data = await BarcodeData.find();
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
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
    const token =  jwt.sign({email:user.email},JWT_SECRET);
    // console.log("token generated",token)
    if(res.status(201)){
      return res.send({ status: "ok", data: token });
    }
  } else {
    return res.send({ status: "error", data: "Invalid credentials" });
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

app.listen(5001, () => {
  console.log("Node js server started.");
});
