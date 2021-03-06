const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const PORT = process.env.PORT || 5555;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/health_camp_spa'));

var server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const { Client } = require('pg');
const dbClient = new Client({
  connectionString: 'postgres://gbvljvprlsbmid:d4b06e74534577714c8f5538c682f47ff2385e28e776c93cda0a184c95fb22ce@ec2-54-156-0-178.compute-1.amazonaws.com:5432/d4bfa1c80lme34',
  ssl: true,
});

dbClient.connect();

app.post('/savePersonalInfo', function(req, res) {
  const text = 'INSERT INTO healthrecords4(Id, FirstName, LastName, Gender, Age, Details, Photo) VALUES($1, $2, $3, $4, $5, $6, $7)';
  const values = [req.body.id, req.body.fn, req.body.ln, req.body.gn, req.body.ag, req.body.dt, req.body.ph];
  dbClient.query(text, values, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
  res.sendStatus(200);
});

app.post('/saveHealthInfo', function(req, res) {
  const text = 'UPDATE healthrecords4 SET Height=$1, Weight=$2, BodyTemp=$3, Pulse=$4, BloodPressure=$5, Medications=$6, Notes=$7 WHERE ID=$8';
  const values = [req.body.ht, req.body.wt, req.body.bt, req.body.pr, req.body.bp, req.body.md, req.body.nt, req.body.id];
  dbClient.query(text, values, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
  res.sendStatus(200);
});

app.get('/retrieveInfo', async function(req, res) {
  const { rows } = await dbClient.query("SELECT * FROM healthrecords4");
  res.send(JSON.stringify(rows));
});

function stop() {
  dbClient.end();
  server.close();
}

module.exports = app;
module.exports.stop = stop;