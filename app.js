const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || process.argv[2] || 3000;
const user = process.env.USER || process.env.USERNAME;
const mongoose = require("mongoose");

//!local package
const date = require("./date.js"); //!get data from local own package
const todayDate = date(); //!get data what it exports

//!mongoDB local
const url = "mongodb://127.0.0.1:27017/todolistDB";

//!mongoDB online
const uri = "mongodb+srv://totoro:totoro@cluster0.cukhued.mongodb.net/todolistDB";


mongoose
  .connect(uri)
  .then(() => app.listen(port, () => {
    console.log(`Server is running on port ${port} and successfully connected to Online DB`);
  }))
  .catch(() => {
    mongoose
    .connect(url)
    .then(() => app.listen(port, () => {
      console.log(`Server is running on port ${port} and successfully connected to Local DB`);
    }))
  });

const todoSchema = new mongoose.Schema({
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
    task: newItem,
  });

  todoo
  .save()
  .then(() => {res.redirect("/")})
  .catch((err) => {console.log(err)});
});

app.post('/delete',(req, res) => {
  const name = req.body.checkbox;
  
  newItems.forEach(item => {
    if(item == name){
      newItems.splice(newItems.indexOf(item), 1);
    };
  });

  Todo.deleteOne({task: name})
  .then(() => {res.redirect('/')})
  .catch(err => {console.log(err)});

});





