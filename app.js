const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://admin:NYtQBZ2qVeGu4LZh@cluster0.ab7ckln.mongodb.net/test")
    .then((val) => {
    console.log("database connected");
  })
  .catch((e) => {
    console.log("error",e);
  });

const schema = new mongoose.Schema({
  dateUpdated: Date,
  adminID: Number,
  data: Object
});

const allDataSchema = new mongoose.Schema({
  dateUpdated: Date,
  data: Object
});

const AllData = mongoose.model("AllData", allDataSchema);

const Data = mongoose.model("AdminPref", schema);

app.post("/adminPref/:adminID", (req,res) => {
    Data.findOne({adminID: parseInt(req.params.adminID)}).then((val) => {
      console.log("value of doc", val);
      if(val){
        const dat = val.data;
        Object.keys(req.body).forEach((k) => {
          dat[k] = req.body[k];
        });
        Data.findByIdAndUpdate(val._id, {
          data: dat,
          dateUpdated: Date.now()
        },{ new : true })
        .then((val2) => {
          console.log("sending result",val2);
          res.json(val2);
        })
        .catch((err) => {
          res.json(err);
        });
      }
      else {
        const dat = {};
        Object.keys(req.body).forEach((k) => {
          dat[k] = req.body[k];
        });
        const site = new Data({
          dataUpdated: Date.now(),
          adminID: parseInt(req.params.adminID),
          data: dat
        });
        console.log("new doc created");
        site.save((err, result) => {
          if(err){
            res.json(err);
          }
          else{
            res.json(result);
          }
        });
      }
    })
    .catch((e) => {
      console.log("error during finding doc", e.toString());
    });
});


app.get("/adminPref/:adminID", (req,res) => {
  Data.findOne({adminID: req.params.adminID})
  .then((val)=> {
    console.log("Value is", val);
    res.json(val.data);
  })
  .catch((err)=>{
    console.log("Error is ", err);
    res.json({status: 400, error: err.toString()});
  })
});


app.post('/addAllData',(req,res) => {
  AllData.findOne({}).then((val) => {
    console.log("value of doc", val);
    if(val){
      const dat = val.data;
      Object.keys(req.body).forEach((k) => {
        dat[k] = req.body[k];
      });
      AllData.findByIdAndUpdate(val._id, {
        data: dat,
        dateUpdated: Date.now()
      },{ new : true })
      .then((val2) => {
        console.log("sending result",val2);
        res.json(val2);
      })
      .catch((err) => {
        res.json(err);
      });
    }
    else {
      const dat = {};
      Object.keys(req.body).forEach((k) => {
        dat[k] = req.body[k];
      });
      const site = new AllData({
        dataUpdated: Date.now(),
        data: dat
      });
      console.log("new doc created");
      site.save((err, result) => {
        if(err){
          res.json(err);
        }
        else{
          res.json(result);
        }
      });
    }
  })
  .catch((e) => {
    console.log("error during finding doc", e.toString());
  });
});


app.get("/addAllData", (req,res) => {
  AllData.findOne({})
  .then((val)=> {
    console.log("Value is", val);
    res.json(val.data);
  })
  .catch((err)=>{
    console.log("Error is ", err);
    res.json({status: 400, error: err.toString()});
  })
});


app.listen(process.env.PORT || 5500, (e) => {
  if (e) {
    console.log(e);
  } else {
    console.log("Server started on port 5500");
  };
});