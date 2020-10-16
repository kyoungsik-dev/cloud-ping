const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const parseCSV = (data) => {
  data = data.split('\n');
  const columns = data[0].split(',');
  data.shift();
  return data.map(row => {
    row = row.split(',');
    const obj = {};
    columns.forEach((col, colIndex) => {
      obj[col] = row[colIndex];
    });
    return obj;
  });
}

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
  const awsPath = path.join(__dirname, 'endpoint', 'aws.csv');
  const azurePath = path.join(__dirname, 'endpoint', 'azure.csv');
  const gcpPath = path.join(__dirname, 'endpoint', 'gcp.csv');

  const aws = parseCSV(fs.readFileSync(awsPath, {encoding: 'utf8'}));
  const azure = parseCSV(fs.readFileSync(azurePath, {encoding: 'utf8'}));
  const gcp = parseCSV(fs.readFileSync(gcpPath, {encoding: 'utf8'}));
  res.render('index', { aws });
});

const port = 3000;
app.listen(port, () => {
  console.log('listening 3000...');
});