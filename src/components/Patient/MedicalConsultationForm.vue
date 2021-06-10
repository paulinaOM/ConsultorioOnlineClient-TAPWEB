<template>
  <div class="container"><br>
    <h4>{{ msg }}</h4>
    <form method="post" @submit.prevent="onSubmit" v-if="patient">
      <div class="form-group">
        <label for="inputSymptom">Síntoma</label>
        <input v-model="symptom" type="text" class="form-control" id="inputSymptom" placeholder="Síntomas" maxlength="200">
      </div>
      <div class="form-group">
        <label for="inputBirthdate">Fecha de consulta</label>
        <input type="date" v-model="consultation_date" class="form-control" id="inputBirthdate" placeholder="Fecha de consulta">
      </div>
      <div class="form-group">
        <label for="selectSpeciality">Especialidad</label>
        <select class="form-control" v-model="id_speciality" id="selectSpeciality" @change="showDoctors(id_speciality)" required>
          <option disabled selected value="">Seleccione una especialidad</option>
          <option v-for="speciality in specialities" v-bind:value="speciality.id" v-bind:key="speciality.id">
            {{ speciality.description }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="selectDoctor">Doctor</label>
        <select class="form-control" v-model="id_doctor" id="selectDoctor" required>
          <option disabled selected value="">Seleccione un doctor</option>
          <option v-for="doctor in doctors" v-bind:value="doctor.id" v-bind:key="doctor.id">
            {{ doctor.name +" "+doctor.lastname }}
          </option>
        </select>
      </div>
      <div>
        <label>File
          <input class="form-control" type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept="image/*"/>
        </label>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
    <p v-else>No tienes permiso para acceder a este contenido</p>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'

export default {

  data() {
    return {
      msg: "Consulta Médica",

      //Datos de consulta medica
      id_patient: '',
      symptom: '',
      atention_status: 1,
      consultation_date: '',
      id_doctor: null,

      //Auxiliares
      doctors: [],
      specialities: [],
      id_speciality:null,
      patient:false,
      userLogged:false,


      //Datos de media
      file: '',
      id_consultation:null,

    };
  },
  mounted() {
    this.getSpecialities();
    this.userLoggedF();
  },
  methods: {
    onSubmit() {
      this.isLoading = true
      this.sendFormMedicalConsultation();

    },
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
          axios.get("http://127.0.0.1:8000/patient/user/"+aux['id'])
              .then((response)=>{
                this.id_patient=response.data.id

              });
        }
      }
    },
    getSpecialities(){
      axios
          .get("http://127.0.0.1:8000/speciality")
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
    sendFormMedicalConsultation(){
      let formDataConsultation = new FormData();

      /*Add the form data we need to submit*/
      formDataConsultation.append('id_patient', this.id_patient);
      formDataConsultation.append('symptom',this.symptom);
      formDataConsultation.append('atention_status',this.atention_status);
      formDataConsultation.append('consultation_date',this.consultation_date);
      formDataConsultation.append('id_doctor',this.id_doctor);

      var object = {};
      formDataConsultation.forEach(function (value, key) {
        object[key] = value;
      });
      var json = JSON.stringify(object);

      /*Make the request to the POST URL*/
      axios.post( 'http://127.0.0.1:8000/medicalconsultation', json,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
      ).then(function(){
        console.log('SUCCESS!! MEDICAL CONSULTATION');
        console.log(json);

      })
          .catch(function(error){
            console.log(json);
            console.log(error);
            console.log('FAILURE!! MEDICAL CONSULTATION');
          });

      this.getIdConsultation();

    },
    getIdConsultation() {
      console.log("obtenemosid");

      axios
          .get("http://127.0.0.1:8000/consultation/last")
          .then((response) => {
            console.log(response.data);
            this.id_consultation= response.data.id;
            console.log(this.id_consultation);

            (this.file && this.id_consultation)? this.sendFormFile(this.id_consultation):console.log("No guardamos media");

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
    sendFormFile(id){
      let formDataFile = new FormData();

      /*Add the form data we need to submit*/
      formDataFile.append('file', this.file);
      formDataFile.append('id_consultation',id);

      /*Make the request to the POST URL*/
      axios.post( 'http://127.0.0.1:8000/media', formDataFile,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
      ).then(function(){
        console.log('SUCCESS!! STORAGE FILE' + id);
        console.log(formDataFile);
        location.href ="/priorConsultation"
      })
          .catch(function(error){
            console.log(formDataFile);
            console.log(error);
            console.log('FAILURE!! STORAGE FILE' + id);
          });
    },

    /*Handles a change on the file upload*/
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
