const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const path = require('path');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(express.static(path.join(__dirname,'public')));

// test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

app.get("/app.html",(req,res)=>{
  res.sendFile(path.join(__dirname,'app.html'));
});

// connect database
mongoose.connect("mongodb://127.0.0.1:27017/studyflow")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});