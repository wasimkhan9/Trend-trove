require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//databse connection start
main()
  .then(() => { 
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() { 
  await mongoose.connect(process.env.MONGO_URL);
}
//database connection end
//image storage engine
const storage = multer.diskStorage({
    destination: './uploads/images', 
    filename: (req, file, cb) => { // Corrected the callback arguments
      cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); // Use the original filename
    }
  });

  let upload = multer({
    storage: storage
  });

  //creating the upload endpoint
  app.use('/images',express.static('upload/images'));
  
  app.post("/upload", upload.single('product'), (req,res)=>{
        res.json({
            success:1,
            image_url:`http://localhost:${process.env.PORT || 3000}/images/${req.file.filename}`
        })
  })

app.get("/",(req,res)=>{
    res.send("express is running");
})

app.listen(port, (req, res)=>{
    console.log("app is listening " + port);
});