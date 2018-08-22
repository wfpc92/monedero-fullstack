<template>
  <div class="hello">
    <h1>Total: {{ total }}</h1>
    <h2>Monedero</h2>
    <ul>
      <li v-bind:key="index" v-for="(item, index) in monedero">
        <div v-if="item.tipo=='B'" class="item-monedero">
          <img class="billete" v-bind:src="item.imagen">
          <input v-model="item.cantidad" v-on:change="actualizar(item)">
        </div>
      </li>
    </ul>
    <ul>
      <li v-bind:key="index" v-for="(item, index) in monedero">
        <div v-if="item.tipo=='M'" class="item-monedero">
          <img class="billete" v-bind:src="item.imagen">
          <input v-model="item.cantidad" v-on:change="actualizar(item)">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

let url = 'http://localhost:5000'

export default {
  name: 'HelloWorld',
  data () {
    return {
      total: 'Cargando total...',
      monedero: []
    }
  },
  mounted () {
    axios({ method: 'GET', url: `${url}/total` }).then(result => {
      console.log(result)
      this.total = result.data.rows[0].total
    }, error => {
      console.error(error)
    })
    axios({ method: 'GET', url: `${url}/monedero` }).then(result => {
      console.log(result)
      this.monedero = result.data.rows
      this.monedero.forEach(m => {
        m.imagen = `${url}/static/img/img-${m.denominacion}-${m.tipo}.jpg`
      })
      this.monedero.sort((a, b) => {
        return Number.parseInt(a.denominacion) - Number.parseInt(b.denominacion)
      })
    }, error => {
      console.error(error)
    })
  },
  methods: {
    actualizar (item) {
      console.log(item)
      let parse = 0
      try {
        parse = Number.parseInt(item.cantidad)
        if (isNaN(parse) || parse < 0) {
          parse = 0
        }
      } catch (err) {
        console.log(err)
        parse = 0
      }
      item.cantidad = parse
      axios({ method: 'POST', url: `${url}/actualizar`, data: {denominacion: item.denominacion, tipo: item.tipo, cantidad: item.cantidad}, 'headers': { 'content-type': 'application/json' } }).then(result => {
        console.log(result.data)
        // this.response = result.data
        axios({ method: 'GET', url: `${url}/total` }).then(result => {
          console.log(result)
          this.total = result.data.rows[0].total
        }, error => {
          console.error(error)
        })
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
  display: inline-table;
}
li {
  display: block;
  margin: 0 10px;
  margin-bottom: 10px;
}
.billete {
  height: 80px;
}
.item-monedero {
  vertical-align: middle;
    align-items: center;
    align-content: center;
    display: flex;
}
a {
  color: #42b983;
}
input {
  width: 40px;
  text-align: center;
}
</style>
