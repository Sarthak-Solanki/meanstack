const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const postsRoutes = require("./routes/post")
const mongoose = require('mongoose')
const path = require('path')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/images",express.static(path.join("backend/images")));
  
mongoose
  .connect(
    'mongodb+srv://Sarthak:m27VAJQW56r8pFSd@cluster0-zenk0.mongodb.net/node-angular?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('connected to database')
  })
  .catch(abc => {
    console.log('some error' + abc)
  });

  

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested_with,Content-Type,Accept'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PATCH,PUT,DELETE,OPTIONS,PUT'
  )
  next()
});

app.use('/api/posts',postsRoutes);

module.exports = app
