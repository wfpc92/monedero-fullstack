// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
app = express();
app.use(serveStatic(__dirname + "/dist"));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const { Pool } = require('pg');


process.env.DATABASE_URL = "postgres://tflmxuvipzpzom:8711f15fff25e0d56b910ff191bb4ef25f76d000069045957d17200c783fcaf5@ec2-107-22-221-60.compute-1.amazonaws.com:5432/d8po5lj0ivhoid";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


pool.connect();

pool.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  //pool.end();
});


app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    res.json(result);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});




var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);



/**
 * Billetera virtual: donde se debe administrar y  visualizar:

 

-Número de billetes por denominación

-El total de saldo que hay




Host
    ec2-107-22-221-60.compute-1.amazonaws.com
Database
    d8po5lj0ivhoid
User
    tflmxuvipzpzom
Port
    5432
Password
    8711f15fff25e0d56b910ff191bb4ef25f76d000069045957d17200c783fcaf5
URI
    postgres://tflmxuvipzpzom:8711f15fff25e0d56b910ff191bb4ef25f76d000069045957d17200c783fcaf5@ec2-107-22-221-60.compute-1.amazonaws.com:5432/d8po5lj0ivhoid
Heroku CLI
    heroku pg:psql postgresql-cubed-41102 --app monedero-fullstack




 */