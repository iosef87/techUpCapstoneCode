import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}));

var postalToGo = "000000";
var addressToGo = "000000";
let coordToGo = [];//to include x and y coordinates
let date = new Date("2023-11-30 1300");
let duration = [1,15]//duration is a list for hr and minutes

app.post('/checkAddress',(req,res) =>{
    postalToGo=req.body.postalCode;
    //to convert postal code to coordinate using gmap api
    console.log(postalToGo);
    res.render("choosePlace.ejs",{
        postalCode:postalToGo,
        coordinates:coordToGo,
    }); 
})

app.post('/duration',(req,res) =>{
    addressToGo="351D Anchorvale Road"//req.body.postalCode;//to change postalCode to address later
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
    //duration = [req.body.hour,req.body.minutes]
    //to convert postal code to coordinate using gmap api
    console.log(date);
    res.render("parking.ejs",{
        postalCode:postalToGo,
        venue:addressToGo,
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
