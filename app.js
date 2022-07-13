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
    console.log("error", e);
  });

const schema = new mongoose.Schema({
  dateUpdated: Date,
  data: Object,
  Email: String,
  Domain: String
});

const Data = mongoose.model("AdminPref", schema);

app.post("/getInitialData", (req, res) => {
  Data.findOne({ Email: req.body.Email })
    .then((val) => {
      if(val){
        console.log("Matched users Data is ", val.data);
        // res.json(val.Email);
        res.json(val.data);
      }
      else{
        res.json("Email not found");
      }
    })
    .catch((err) => {
      console.log("Error is ", err);
      res.json({ status: 400, error: err.toString() })
    })
})

app.post("/adminPref", (req, res) => {
  Data.findOne({ Email: req.body.Email })
    .then((val) => {
      console.log("value of doc", val);
      if (val) {
        const dat = val.data;
        Object.keys(req.body.data).forEach((k) => {
          dat[k] = req.body.data[k];
        });
        Data.findByIdAndUpdate(val._id, {
          data: dat,
          dateUpdated: Date.now()
        }, { new: true })
          .then((val2) => {
            console.log("sending result", val2);
            res.json(val2);
          })
          .catch((err) => {
            res.json(err);
          });
      }
      else{
        Data.create({
          Email: req.body.Email,
          Domain: req.body.Domain,
          data: req.body.data,
          dateUpdated: Date.now(),
        }, (err,res) => {
          if(err){
            console.log('could not insert')
            throw err
          }
          console.log('inserted new user')
        })
      }
    })
    .catch((e) => {
      console.log("error during finding doc", e.toString());
    });
});

app.post("/getAllData", (req, res) => {
  Data.findOne({ Domain: req.body.Domain })
    .then((val) => {
      if(val){
        console.log("Required Data by the user is", val.data);
        // res.json(val.Email);
        res.json(val.data);
      }
      else{
        res.json("Domain not found");
      }
    })
    .catch((err) => {
      console.log("Error is ", err);
      res.json({ status: 400, error: err.toString() });
    })
});

app.listen(process.env.PORT || 5500, (e) => {
  if (e) {
    console.log(e);
  } else {
    console.log("Server started on port 5500");
  };
});






































// app.post("/adminPref/:adminID", (req,res) => {
//     Data.users.find({userID : req.body.users.userID}).then((val) => {
//       console.log("Data received is: ", val);

//     })});


// app.get("/adminPref/:adminID", (req,res) => {
//   Data.findOne({adminID: req.params.adminID})
//   .then((val)=> {
//     console.log("Value is", val);
//     res.json(val.data);
//   })
//   .catch((err)=>{
//     console.log("Error is ", err);
//     res.json({status: 400, error: err.toString()});
//   })
// });


// app.post('/addAllData',(req,res) => {
//   AllData.findOne({}).then((val) => {
//     console.log("value of doc", val);
//     if(val){
//       const dat = val.data;
//       Object.keys(req.body).forEach((k) => {
//         dat[k] = req.body[k];
//       });
//       AllData.findByIdAndUpdate(val._id, {
//         data: dat,
//         dateUpdated: Date.now()
//       },{ new : true })
//       .then((val2) => {
//         console.log("sending result",val2);
//         res.json(val2);
//       })
//       .catch((err) => {
//         res.json(err);
//       });
//     }
//     else {
//       const dat = {};
//       Object.keys(req.body).forEach((k) => {
//         dat[k] = req.body[k];
//       });
//       const site = new AllData({
//         dataUpdated: Date.now(),
//         data: dat
//       });
//       console.log("new doc created");
//       site.save((err, result) => {
//         if(err){
//           res.json(err);
//         }
//         else{
//           res.json(result);
//         }
//       });
//     }
//   })
//   .catch((e) => {
//     console.log("error during finding doc", e.toString());
//   });
// });


// app.get("/addAllData", (req,res) => {
//   AllData.findOne({})
//   .then((val)=> {
//     console.log("Value is", val);
//     res.json(val.data);
//   })
//   .catch((err)=>{
//     console.log("Error is ", err);
//     res.json({status: 400, error: err.toString()});
//   })
// });


// app.listen(process.env.PORT || 5500, (e) => {
//   if (e) {
//     console.log(e);
//   } else {
//     console.log("Server started on port 5500");
//   };
// });