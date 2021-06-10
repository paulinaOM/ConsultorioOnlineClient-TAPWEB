<template>
  <div class="container">
    <v-app v-if="patient">
      <v-card>
        <h4>Historial de compras</h4>
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
            :items="tickets"
            :search="search"
        >

          <template v-slot:item.file="{ item }">
            <v-btn
                class="mx-2 btn-info"
                fab
                dark
                small
                color="#17bbb5"
                @click.native="openTicket(item)"
            >
              <a :href="item.file" class="algo" target="_blank">
                <v-icon
                    dark
                    color="#fff"
                >
                  mdi-clipboard-text-search-outline
                </v-icon></a>
            </v-btn>
          </template>
        </v-data-table>

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
      patient:false,
      userLogged:false,
      loading: true,
      id_patient: 1,
      tickets: [],
      search: '',
      headers: [
        {text: 'Fecha de compra', value: 'date_sale'},
        {text: 'Ver ticket', value: 'file' },
      ],
    }
  },
  mounted() {
    this.userLoggedF()
    this.readDataFromAPI();
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
          .get("http://127.0.0.1:8000/patient/"+this.id_patient+"/tickets")
          .then((response) => {
            console.log(response.data);
            this.tickets = response.data;
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
    openTicket(idConsultation){
      console.log(idConsultation.id);
    },
  },
  //this will trigger in the onReady State

}
</script>

<style>
a.algo{
  text-decoration: #ff0;
}


</style>

