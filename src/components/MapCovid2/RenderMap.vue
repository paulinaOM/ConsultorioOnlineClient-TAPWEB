<template>
  <v-app>
    <div>
      <h3 style="text-align: center;">Mapa casos COVID-19</h3>
      <GoogleMap :latitude= 19.4326077 :longitude= -99.133208 :title="'Titulo Marcador'" />
    </div>
    <div style="margin-top: 30px">
      <h3>República Mexicana</h3>
      <div class="principal-container">
        <div>
          <p>{{ province }}</p>
          <v-data-table
              :headers="headers"
              :items="cities"
          ></v-data-table>
        </div>
        <div>
          <MexicoProvincesMap @map-click="onMapClick"/>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import GoogleMap from "./GoogleMap";

import axios from "axios";
import MexicoProvincesMap from "@/components/MexicoProvincesMap";

export default {
  name: 'RenderMap',
  components: {
    GoogleMap,
    MexicoProvincesMap
  },
  data() {
    return {
      province: "[Seleccione]",
      tableVisible:false,
      headers: [
        { text: 'Ciudad', value: 'city'},
        { text: 'Confirmados', value: 'confirmed', class:'error--text'},
        { text: 'Sospechosos', value: 'suspect', class:'warning--text'},
        { text: 'Negativos', value: 'negative', class:'success--text'},
      ],
      cities:[],
    };
  },
  methods: {
    onMapClick(e) {
      this.province = e.title;
      this.tableVisible = true;
      axios
          .get("http://127.0.0.1:8000/patient/covid/"+this.province)
          .then((response) => {
            console.log(response.data);
            this.cities = response.data;
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.headers);
            }
            else if (error.request) {
              console.log(error.request);
            }
            else {
              console.log(error.message);
            }
            console.log(error.config);
          });
    }
  }
}
</script>

<style>
.principal-container{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
}

</style>
