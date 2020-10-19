const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const parseCSV = (data) => {
  data = data.split('\n');
  const columns = data[0].split(',');
  data.shift();
  data.pop();
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
  res.render('index', { theme: 'light', csp: 'none'});
});
app.get('/aws', (req, res) => {
  const filepath = path.join(__dirname, 'endpoint', 'aws.csv');
  const regions = parseCSV(fs.readFileSync(filepath, {encoding: 'utf8'}));
  res.render('ping', { theme: 'dark', csp: 'aws', regions });
});
app.get('/azure', (req, res) => {
  const filepath = path.join(__dirname, 'endpoint', 'azure.csv');
  const regions = parseCSV(fs.readFileSync(filepath, {encoding: 'utf8'}));
  res.render('ping', { theme: 'dark', csp: 'azure', regions });
});
app.get('/gcp', (req, res) => {
  const filepath = path.join(__dirname, 'endpoint', 'gcp.csv');
  const regions = parseCSV(fs.readFileSync(filepath, {encoding: 'utf8'}));
  res.render('ping', { theme: 'dark', csp: 'gcp', regions });
});

const port = 3000;
app.listen(port, () => {
  console.log('listening 3000...');
});