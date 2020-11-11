//jshint esversion: 6

const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

require('dotenv').config({path: __dirname + '/.env'})


var apiKey = process.env.MAILCHIMP_API_KEY;
var audID = process.env.MAILCHIMP_AUD_ID;

// app.listen(3000,function(req,res){
//   console.log("Server is running on port 3000.");
// });

app.listen(process.env.PORT || 3000,function(req,res){
  console.log("Server is running on port 3000.");
});

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/",function(req,res)
{
  res.sendFile(__dirname+"/signup.html");
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.post("/",function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members:[
      {
        email_address : email,
        status: "subscribed",
        merge_fields:{
          FNAME : firstName,
          LNAME : lastName
        }

      }
    ]
  }

  const jsonData =  JSON.stringify(data);
  const url = "https://us19.api.mailchimp.com/3.0/lists/"+audID;
  const options = {
    method:"POST",
    auth:"belgin:"+apiKey
  }

  const request = https.request(url,options,function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
      //res.send("Successfully subscribed!");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
      //res.send("There was an error while signing up, please try again!");
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});
