var express = require('express');
var app = express();
var path = require('path');

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
// app.use("/public", express.static(__dirname + '/public'));

// viewed at based directory http://localhost:3000/
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
    console.log(`App running in port ${port}`);
});