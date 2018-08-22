// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
app = express();
app.use(serveStatic(__dirname + "/dist"));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json());

const { Pool } = require('pg');


process.env.DATABASE_URL = "postgres://tflmxuvipzpzom:8711f15fff25e0d56b910ff191bb4ef25f76d000069045957d17200c783fcaf5@ec2-107-22-221-60.compute-1.amazonaws.com:5432/d8po5lj0ivhoid";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


pool.connect();

app.get('/total', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('select sum(CAST (denominacion as INTEGER) * cantidad ) total from monedero');
    res.json(result);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/monedero', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('select * from monedero order by denominacion, tipo')
    res.json(result)
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
});

app.post('/actualizar', async (req, res) => {
  try {
    console.log(req.body)
    var parametros = req.body
    const client = await pool.connect()
    const result = await client.query(`UPDATE public.monedero SET cantidad=${parametros.cantidad} WHERE denominacion='${parametros.denominacion}' AND tipo='${parametros.tipo}'`)
    res.json(result)
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started ' + port);