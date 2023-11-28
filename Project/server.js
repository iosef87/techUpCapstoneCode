import express from "express";
import bodyParser from "body-parser";
import { createRequire } from "module";
import https from "https";
const require = createRequire(import.meta.url);
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
var date = new Date("2023-11-30 13:00");
var duration = {hour:1,minute:15}//duration is a list for hr and minutes

//middleware here

//obtain possible addresses using search key entered by user
function getPossibleAddress(searchVal,callback){
  
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
    console.log(placesToGo);
  };


  xhr.send(data);

}



//frontend interaction here

app.post('/checkAddress',(req,res) =>{
    postalToGo=req.body.postalCode;
    //to convert postal code to coordinate using onemap api
    //for testing
    /*placesToGo=[df
      {
        "SEARCHVAL": "FUNAN",
        "BLK_NO": "109",
        "ROAD_NAME": "NORTH BRIDGE ROAD",
        "BUILDING": "FUNAN",
        "ADDRESS": "109 NORTH BRIDGE ROAD FUNAN SINGAPORE 179097",
        "POSTAL": "179097",
        "X": "29855.362511972",
        "Y": "30416.1814862192",
        "LATITUDE": "1.29134759697794",
        "LONGITUDE": "103.849989789813"
      },
      {
        "SEARCHVAL": "FUNAN",
        "BLK_NO": "107",
        "ROAD_NAME": "NORTH BRIDGE ROAD",
        "BUILDING": "FUNAN",
        "ADDRESS": "107 NORTH BRIDGE ROAD FUNAN SINGAPORE 179105",
        "POSTAL": "179105",
        "X": "29854.8061561631",
        "Y": "30404.7269309964",
        "LATITUDE": "1.29124400604241",
        "LONGITUDE": "103.849984790048"
      },
      {
        "SEARCHVAL": "FUNAN O1",
        "BLK_NO": "109",
        "ROAD_NAME": "NORTH BRIDGE ROAD",
        "BUILDING": "FUNAN O1",
        "ADDRESS": "109 NORTH BRIDGE ROAD FUNAN O1 SINGAPORE 179097",
        "POSTAL": "179097",
        "X": "29887.9367647087",
        "Y": "30418.9446201846",
        "LATITUDE": "1.29137258384263",
        "LONGITUDE": "103.850282483296"
      },
      {
        "SEARCHVAL": "FUNAN O2",
        "BLK_NO": "109",
        "ROAD_NAME": "NORTH BRIDGE ROAD",
        "BUILDING": "FUNAN O2",
        "ADDRESS": "109 NORTH BRIDGE ROAD FUNAN O2 SINGAPORE 179097",
        "POSTAL": "179097",
        "X": "29842.5918745501",
        "Y": "30390.9751266148",
        "LATITUDE": "1.29111964028141",
        "LONGITUDE": "103.849875038808"
      }
    ]
    //console.log(placesToGo);
    */
    //end testing
    getPossibleAddress(postalToGo);
    //console.log(postalToGo);
    res.render("choosePlace.ejs",{
        postalCode:postalToGo,
        places:placesToGo,
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
