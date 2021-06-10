<template>
  <v-app class="container" v-if="patient">
    <v-card>
      <h4>Consultas Previas</h4>
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
          :items="consultations"
          :search="search"
      >

        <template v-slot:item.prescription="{ item }">
          <v-btn
              v-if="prescriptions.includes(item.id)"
              class="mx-2 btn-info"
              fab
              dark
              small
              color="#17bbb5"
              @click.native="openPrescription(item)"
          >
            <a :href="prescriptionsData[prescriptions.indexOf(item.id)].file" class="algo" target="_blank">
              <v-icon
                  dark
                  color="#fff"
              >
                mdi-clipboard-text-search-outline
              </v-icon></a>
          </v-btn>
        </template>

        <template v-slot:item.bill="{ item }">
          <v-btn
              v-if="bills.includes(item.id)"
              class="mx-2 btn-info"
              fab
              dark
              small
              color="#17bbb5"
              @click.native="openBill(item)"
          >
            <a :href="billsData[bills.indexOf(item.id)].file" class="algo" target="_blank">
              <v-icon
                  dark
                  color="#fff"
              >
                mdi-file-pdf
              </v-icon></a>
          </v-btn>
        </template>

      </v-data-table>

    </v-card>
  </v-app>
  <div v-else class="alert alert-danger" role="alert">
    No tienes permiso para acceder a este contenido. <a href="/home" class="alert-link">Ir a principal</a>.
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from "js-cookie";

export default {
  data () {
    return {
      loading: true,
      id_patient: '',
      id_doctor:'',
      consultations: [],
      prescriptionsData:[],
      prescriptions:[],
      billsData:[],
      bills:[],
      patient:false,
      userLogged:false,
      search: '',
      headers: [
        {text: 'Fecha', value: 'consultation_date'},
        { text: 'Paciente', value: 'patient_name' },
        { text: 'Síntomas', value: 'symptom' },
        { text: 'Estatus de atención', value: 'atention_status' },
        { text: 'Ver receta', value: 'prescription' },
        { text: 'Ver factura', value: 'bill' },
      ],
    }
  },
  mounted() {
    this.readDataFromAPI();
    this.userLoggedF();
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
        if(aux['role']=='1'){
          this.patient=true
          axios.get("http://127.0.0.1:8000/doctor/user/"+aux['id'])
              .then((response)=>{
                this.id_doctor=response.data.id
              });
        }
      }
    },
    //Reading data from API method.
    readDataFromAPI() {
      this.loading = true;
      this.user= Cookies.get('userLogged');
      let aux=JSON.parse(this.user)
      axios.get("http://127.0.0.1:8000/doctor/user/"+aux['id'])
          .then((response)=>{
            this.id_doctor=response.data.id
            axios
                .get("http://127.0.0.1:8000/medicalconsultation/doctor/"+this.id_doctor)
                .then((response) => {
                  console.log(response.data);
                  this.consultations = response.data;
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
            axios
                .get("http://127.0.0.1:8000/doctor/"+this.id_doctor+"/prescriptions")
                .then((response) => {
                  console.log(response.data);
                  this.prescriptionsData = response.data;
                  console.log(this.prescriptionsData);
                  (this.prescriptionsData.length!="")? this.prescriptionsData.forEach(element=> this.prescriptions.push(element.id_consultation)): null;
                  console.log(this.prescriptions);
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
            axios
                .get("http://127.0.0.1:8000/doctor/"+this.id_doctor+"/bills")
                .then((response) => {
                  console.log(response.data);
                  this.billsData = response.data;
                  console.log(this.billsData);
                  (this.billsData.length!="")? this.billsData.forEach(element=> this.bills.push(element.id_consultation)): null;
                  console.log(this.bills);
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

          });

    },
    openPrescription(idConsultation){
      console.log(idConsultation.id);
    },
    openBill(idConsultation){
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

