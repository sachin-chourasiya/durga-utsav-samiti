const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));

app.use('/', require('./routes/memberRoutes'));

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));