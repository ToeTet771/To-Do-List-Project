const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || process.argv[2] || 3000;
const user = process.env.USER || process.env.USERNAME;

const date = require('./date.js');   //!get data from local own package
const todayDate = date();            //!get data what it exports


//!Middleware
app.set("view engine", "ejs"); //!setting ejs in express and need to create (views) folder in current dir and add ejs file
// app.use(express.json()); //!when request JSON to parse Data
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); //!when request url encode to parse Data






let newItems = [];


app.get("/", (req, res) => {
 
  res.render("./list.ejs", { kindOfDay: todayDate, newListItems : newItems, userName : user}); //!render ejs file and assign the key/value and key was add in ejs <%= %>
});

app.post("/", (req, res) => {
  let newItem = req.body.newItem;
  newItems.push(newItem);
  newItems.reverse();
  res.redirect("/");
});




app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
