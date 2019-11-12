const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

app.use(express.static(path.join(__dirname,'/public')))

app.get('/')
app.listen(port)        