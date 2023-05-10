const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || process.argv[2] || 3000;
const user = process.env.USER || process.env.USERNAME;
const mongoose = require("mongoose");

//!local package
const date = require("./date.js"); //!get data from local own package
const todayDate = date(); //!get data what it exports

//!mongoDB
const url = "mongodb://127.0.0.1:27017/todolistDB";

mongoose
  .connect(url)
  .then(() => console.log('connected to DB'))
  .catch((err) => console.log(err));

const todoSchema = new mongoose.Schema({
  id: Number,
  task: {
    type: String,
    minlength: [1,'task need to add!!'],
    require: [true]
  }
});

const Todo = mongoose.model("Todo", todoSchema); //!connect schema to collection

let newItems = [];


Todo
.find()
.then((todos) => {
  todos.forEach((todo) => {
    newItems.push(todo.task);
  })
})
.catch((err) => console.log(err));



//!Middleware
app.set("view engine", "ejs"); //!setting ejs in express and need to create (views) folder in current dir and add ejs file
// app.use(express.json()); //!when request JSON to parse Data
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); //!when request url encode to parse Data



app.get("/", (req, res) => {
  res.render("./list.ejs", {
    kindOfDay: todayDate,
    newListItems: newItems,
    userName: user,
  }); //!render ejs file and assign the key/value and key was add in ejs <%= %>
});

app.post("/", (req, res) => {
  let newItem = req.body.newItem;
  newItems.push(newItem);
  newItems.reverse();

  let todoo = new Todo({
    id: newItems.length,
    task: newItem,
  });
  console.log(todoo);

  todoo
  .save()
  .then(() => {res.redirect("/")})
  .catch((err) => {console.log(err)});

});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
