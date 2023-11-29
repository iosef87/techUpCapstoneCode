import express from "express";
import bodyParser from "body-parser";
import { createRequire } from "module";
import https from "https";
const require = createRequire(import.meta.url);
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

import dotenv from 'dotenv';
dotenv.config();

const PORT=process.env.PORT?process.env.PORT:8080;

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

//global variable here
var postalToGo = "179097";
var addressToGo = "109 North Bridge Road";
var placesToGo = [];//to include search results
var selectedPlace;
var date = new Date("2023-11-30 13:00");
var duration = {hour:1,minute:15}//duration is a list for hr and minutes

//middleware here

//obtain possible addresses using search key entered by user
function getPossibleAddress(searchVal, callback){
  let searchstr="https://www.onemap.gov.sg/api/common/elastic/search?searchVal="+searchVal+"&returnGeom=Y&getAddrDetails=Y&pageNum=1";
  const data = JSON.stringify(false);
      
  const xhr = new XMLHttpRequest();
      
  xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
        }
      });
       
  xhr.open("GET", searchstr);
  
  xhr.onload = () => {
    // Request finished. Do processing here.
    const obj = JSON.parse(xhr.responseText);
    placesToGo=obj.results;
    //console.log('from one map', placesToGo)
    //use callback function to process the data only on response from onemap
    callback();
  };

  xhr.send(data);

}

//callback function to be called when api request is done
function checkAddressCallback(res) {
  res.render("choosePlace.ejs",{
    postalCode:postalToGo,
    places:placesToGo,
});
}


//frontend interaction here

app.post('/checkAddress',(req,res) =>{
    postalToGo=req.body.postalCode;
    //to convert postal code to coordinate using onemap api
    getPossibleAddress(postalToGo, () => checkAddressCallback(res));
})

app.post('/duration',(req,res) =>{
    //addressToGo=req.body.postalCode;//to change postalCode to address later
    //to convert postal code to coordinate using gmap api
    selectedPlace=req.body.selectedAddress;
    console.log(selectedPlace);
    res.render("duration.ejs",{
        postalCode:postalToGo,
        venue:selectedPlace,
    }); 
})

app.post('/getParking',(req,res) =>{
    //convert input date to date object
    console.log(date.getHours());
    date = new Date(req.body.startDate+" "+req.body.startHour+":"+req.body.startMinute);
    //get duration input
    duration.hour = req.body.hHour;
    duration.minute = req.body.mMinute;
    //to convert postal code to coordinate using gmap api

    //calculate distance

    console.log(req.body,"\ndate",date,"\duration",duration);
    res.render("parking.ejs",{
        postalCode:postalToGo,
        venue:addressToGo,
        date:date.toLocaleString(),
        durationHr:duration.hour,
        durationMin:duration.minute,
    }); 
})

app.get('/',(req,res) =>{
  res.render("index.ejs");
})

app.get('/about',(req,res) =>{
  res.render("about.ejs");
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});