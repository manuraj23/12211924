require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
app.use(express.json());
app.use('/', urlRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
}).catch(err => {
  console.error("Mongo connection failed", err.message);
});
