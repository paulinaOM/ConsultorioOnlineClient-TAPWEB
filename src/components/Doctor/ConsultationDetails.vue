<template>
  <v-app>
  <div class="container" v-if="doctor">
    <h4>Detalles de la consulta</h4><br>
    <div class="row"  >
      <div class="col-4"><b>Nombre: </b>{{patient_name}}</div>
      <div class="col-4"><b>Edad: </b>{{age}}</div>
      <div class="col-2">
        <div class="text-center">
          <template>
          <v-dialog
              v-model="dialog"
              width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="teal"
                  dark
                  v-bind="attrs"
                  v-on="on">
                Canalizar
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-2">
                Canalizar paciente a otro especialista
              </v-card-title>
              <v-card-text>
                <div class="form-group">
                  <label for="selectSpeciality">Especialidad</label>
                  <select class="form-control" v-model="id_speciality_select" id="selectSpeciality" @change="showDoctors(id_speciality_select)" required>
                    <option disabled selected value="">Seleccione una especialidad</option>
                    <option :id="'opt'+speciality.id" v-for="speciality in specialities" v-bind:value="speciality.id" v-bind:key="speciality.id">
                      {{ speciality.description }}

                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="selectDoctor">Doctor</label>
                  <select class="form-control" v-model="id_doctor_select" id="selectDoctor" required>
                    <option disabled selected value="-1">Seleccione un doctor</option>
                    <option v-for="doctor in doctors" v-bind:value="doctor.id" v-bind:key="doctor.id">
                      {{ doctor.name +" "+doctor.lastname }}
                    </option>
                  </select>
                </div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="canalize(id_consultation,id_doctor_select);
                    dialog=false;">
                  Aceptar
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog=false;
                    id_doctor_select=-1;
                    id_speciality_select=-1;
                   ">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog></template>
        </div>
      </div>
      <div class="col-2">
        <div class="text-center">
          <template>
            <v-dialog
                v-model="dialog2"
                width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="teal"
                    dark
                    v-bind="attrs"
                    v-on="on">
                  Status covid-19
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Actualizar status COVID-19 del paciente
                </v-card-title>
                <v-card-text>
                  <div class="form-group">
                    <label for="selectStatus">Status</label>
                    <select class="form-control" v-model="status" id="selectStatus" required>
                      <option disabled value="-1">Seleccione el status covid</option>
                      <option  value="negativo">Negativo</option>
                      <option  value="sospechoso">Sospechoso</option>
                      <option  value="confirmado">Confirmado</option>
                    </select>
                  </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="updateStatus(id_patient,status);dialog2=false">
                    Actualizar
                  </v-btn>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="dialog2=false;
                    id_doctor_select=-1;
                    id_speciality_select=-1;
                   ">
                    Cancelar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog></template>
        </div>
      </div>
    </div><hr><br><br>

    <div class="row" style="margin-left: 10%">
          <div class="col-sm-6" style="align-content: center" >
            <img :src="media" alt="Imagen sintomas" style="width: 50%; margin-left: 25%;max-height: 250px">
          </div>
          <div class="card" style="width: 20rem;">
            <div class="card-body">
              <h5 class="card-title" >Síntomas</h5>
              <p class="card-text" style="text-align: justify">{{symptom}}</p>
            </div>
          </div>
    </div><br><br>
    <div class="row" style="margin-left: 15%;">
      <div class="col-4" style="max-width: 18rem;" >
          <ul class="list-group-item">
            <li class="list-group-item list-group-item-info">Alergías</li>
            <li class="list-group-item list-group-item-action list-group-item-light" v-for="allergy in allergies"  :key="allergy.id">{{allergy.description}}</li>
          </ul>
      </div>
      <div class="col-4" style="max-width: 18rem;" >
        <ul class="list-group-item">
          <li class="list-group-item list-group-item-info">Enfermedades crónicas</li>
          <li class="list-group-item list-group-item-action list-group-item-light" v-for="disease in diseases"  :key="disease.id">{{disease.description}}</li>
        </ul>
      </div>
      <div class="col-4" style="max-width: 18rem;" >
        <ul class="list-group-item">
          <li class="list-group-item list-group-item-info">Cirugías</li>
          <li class="list-group-item list-group-item-action list-group-item-light" v-for="surgery in surgeries"  :key="surgery.id">{{surgery.description}}</li>
        </ul>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" v-on:click="getPrescription(id_consultation)">Recetar</button>
    </div>
  </div>
  <div v-else class="alert alert-danger" role="alert">
    No tienes permiso para acceder a este contenido. <a href="/home" class="alert-link">Ir a principal</a>.
  </div></v-app>
</template>
<script>
import Cookies from "js-cookie";
import axios from "axios";

export default{
  data(){
    return{
      id_consultation:'',
      id_doctor:'',
      patient_name:'',
      id_patient:'',
      media:'',
      symptom:'',
      age:0,
      status:'',
      allergies:[],
      diseases:[],
      surgeries:[],
      doctor:false,

      //modal
      dialog: false,
      dialog2: false,
      doctors: [],
      specialities: [],
      id_speciality:null,
      id_speciality_select:-1,
      id_doctor_select:-1,
    }
  },
  methods:{
    canalize(id,id_doctor){
      console.log("id"+id_doctor)
      axios.post( 'http://127.0.0.1:8000/medicalconsultation/update/'+id+'/'+id_doctor)
          .then(function(){
            console.log('SUCCESS!! UPDATE CONSULTATION');
            //this.dialog=false
            location.href ="/consultationList"
          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! UPDATE CONSULTATION');
          });
    },
    initialize(){
      //Obtiene los parámetros envíados en la ruta a través de GET
      this.id_consultation=this.$route.params.id;

      //userLogeed y autenticación
      this.user= Cookies.get('userLogged');
      if (this.user==null){
        this.userLogged=false
      }
      else{
        this.userLogged=true
        let aux=JSON.parse(this.user)
        if(aux['role']=='1'){
          this.doctor=true
          axios.get("http://127.0.0.1:8000/doctor/user/"+aux['id'])
              .then((response)=>{
                this.id_doctor=response.data.id
                this.id_speciality=response.data.id_speciality

                axios

                    .get("http://127.0.0.1:8000/speciality/canalize/"+this.id_speciality)
                    .then((response) => {
                      console.log(response.data);
                      this.specialities = response.data;
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

                axios.get("http://127.0.0.1:8000/medicalconsultation/"+this.id_consultation)
                    .then((response)=>{
                      this.id_patient=response.data.id_patient
                      this.patient_name=response.data.patient_name
                      console.log(this.patient_name)
                      this.symptom=response.data.symptom
                      axios.get("http://127.0.0.1:8000/media/consultation/"+this.id_consultation)
                          .then((response)=>{
                            this.media=response.data.image

                          });
                      axios.get("http://127.0.0.1:8000/patient/"+this.id_patient)
                          .then((response)=>{
                            this.status=response.data.status_covid

                          });
                      axios.get("http://127.0.0.1:8000/patient/allergy/"+this.id_patient)
                          .then((response)=>{
                            this.allergies=response.data
                          })
                      axios.get("http://127.0.0.1:8000/patient/disease/"+this.id_patient)
                          .then((response)=>{
                            this.diseases=response.data
                          })
                      axios.get("http://127.0.0.1:8000/patient/surgery/"+this.id_patient)
                          .then((response)=>{
                            this.surgeries=response.data
                          })
                      axios.get("http://127.0.0.1:8000/patient/"+this.id_patient)
                          .then((response)=>{
                            this.age=response.data.age
                          })

                    });
              });
        }
      }

    },
    updateStatus(id,status){
      axios.put( 'http://127.0.0.1:8000/patient/updatestatus/'+id+'/'+status)
          .then(function(){
            console.log('SUCCESS!! UPDATE STATUS COVID');
          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! UPDATE STATUS COVID');
          });

    },
    getPrescription(id){
      this.$router.push({
        name: "prescription",
        params:{
          id: id,
        }
      });
    },
    showDoctors(id_speciality){
      console.log(id_speciality)
      axios
          .get("http://127.0.0.1:8000/doctor/speciality/"+id_speciality)
          .then((response) => {
            console.log(response.data);
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
  mounted() {

    this.initialize();
  }
}
</script>
<style>

</style>