<template>
  <div class="container">

  <v-app v-if="patient">
    <h4>Médicos</h4>
    <v-card>
      <v-card-title>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="doctors"
          :search="search"
      ></v-data-table>
    </v-card>
  </v-app>

  <div v-else class="alert alert-danger" role="alert">
    No tienes permiso para acceder a este contenido. <a href="/home" class="alert-link">Ir a principal</a>.
  </div>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from "js-cookie";

export default {
  data () {
    return {
      loading: true,
      doctors: [],
      search: '',
      patient:false,
      userLogged:false,

      headers: [
        {text: 'Name', value: 'name'},
        { text: 'Lastname', value: 'lastname' },
        { text: 'Speciality', value: 'speciality' },
        { text: 'City', value: 'city' },
        { text: 'State', value: 'state' },
        { text: 'Country', value: 'country' },
        { text: 'Email', value: 'email' },
      ],
    }
  },
  methods: {
    userLoggedF() {
      this.user= Cookies.get('userLogged');

      if (this.user==null){
        this.userLogged=false
      }
      else{
        this.userLogged=true
        let aux=JSON.parse(this.user)
        console.log(aux['role'])
        if(aux['role']=='2'){
          this.patient=true;
        }
      }
    },
    //Reading data from API method.
    readDataFromAPI() {
      this.loading = true;
      axios
          .get("http://127.0.0.1:8000/doctor")
          .then((response) => {
            console.log(response.data.request);
            this.doctors = response.data;
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
    },
  },
  //this will trigger in the onReady State
  mounted() {
    this.readDataFromAPI();
    this.userLoggedF();
  },
}
</script>

<style>


</style>

