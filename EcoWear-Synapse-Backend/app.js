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

// Endpoint to fetch data based on barcode_id
app.get('/api/barcode-data/:barcode_id', async (req, res) => {
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
      console.log(data)
      return res.send({status:"ok",data:data})
    });
  }catch(error){
    return res.send({error:error})
  }
})

app.listen(5001, () => {
  console.log("Node js server started.");
});
