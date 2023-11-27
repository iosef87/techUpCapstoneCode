import express from "express";
import bodyParser from "body-parser";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}));

//global variable here

var postalToGo = "179097";
var addressToGo = "109 North Bridge Road";
var coordToGo = {xCoord:1,yCoord:15};//to include x and y coordinates
var date = new Date("2023-11-30 13:00");
var duration = {hour:1,minute:15}//duration is a list for hr and minutes

//middleware here

//obtain possible addresses using search key entered by user
function getPossibleAddress(searchVal){
  
  const data = JSON.stringify(false);
  let searchstr="https://www.onemap.gov.sg/api/common/elastic/search?searchVal="+searchVal+"&returnGeom=Y&getAddrDetails=Y&pageNum=1";
  
  const xhr = new XMLHttpRequest();
      
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {

    }
  });
  
  console.log(searchstr);
  xhr.open("GET", searchstr);
  console.log(xhr);    
  xhr.send(data);
  console.log(xhr.responseXML);
  //next();
}



//frontend interaction here

app.post('/checkAddress',(req,res) =>{
    postalToGo=req.body.postalCode;
    //to convert postal code to coordinate using onemap api
    getPossibleAddress(postalToGo);
    //console.log(postalToGo);
    res.render("choosePlace.ejs",{
        postalCode:postalToGo,
        coordinates:coordToGo,
    }); 
})

app.post('/duration',(req,res) =>{
    //addressToGo=req.body.postalCode;//to change postalCode to address later
    //to convert postal code to coordinate using gmap api
    console.log(addressToGo);
    res.render("duration.ejs",{
        postalCode:postalToGo,
        venue:addressToGo,
    }); 
})

app.post('/getParking',(req,res) =>{
    //convert input date to date object

    //get duration input
    //duration = {req.body.hour,req.body.minute}
    //to convert postal code to coordinate using gmap api

    //calculate distance

    console.log(date);
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
