<template>
  <v-app>
    <div class="container" v-if="patient">

      <h4 class="mb-3">Historia Clínica</h4>
      <v-card
          color="blue-grey darken-1"
          dark
          :loading="isUpdating"
      >
        <template v-slot:progress>
          <v-progress-linear
              absolute
              color="green lighten-3"
              height="4"
              indeterminate
          ></v-progress-linear>
        </template>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                    v-model="allergiesSelected"
                    :items="allergies"
                    :disabled="isUpdating"
                    filled
                    chips
                    color="blue-grey lighten-2"
                    label="Seleccione las alergías que tenga"
                    item-text="description"
                    item-value="id"
                    multiple
                >
                  <template v-slot:selection="data">
                    <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="remove1(data.item)"
                    >
                      {{ data.item.description }}
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.description"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                    v-model="diseaseSelected"
                    :items="diseases"
                    :disabled="isUpdating"
                    filled
                    chips
                    color="blue-grey lighten-2"
                    label="Seleccione las enfermedades crónicas que padezca"
                    item-text="description"
                    item-value="id"
                    multiple
                >
                  <template v-slot:selection="data">
                    <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="remove2(data.item)"
                    >
                      {{ data.item.description }}
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.description"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-autocomplete
                    v-model="surgerySelected"
                    :items="surgeries"
                    :disabled="isUpdating"
                    filled
                    chips
                    color="blue-grey lighten-2"
                    label="Seleccione las cirugías a las que se ha sometido"
                    item-text="description"
                    item-value="id"
                    multiple
                >
                  <template v-slot:selection="data">
                    <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="remove3(data.item)"
                    >
                      {{ data.item.description }}
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.description"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-divider></v-divider>

      </v-card><br>
      <div class="modal-footer">
        <button type="button" @click="onSubmit(id_patient)" class="btn btn-primary">Guardar</button>
      </div>
    </div>
    <div v-else class="alert alert-danger" role="alert">
      No tienes permiso para acceder a este contenido. <a href="/home" class="alert-link">Ir a principal</a>.
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'
import Cookies from "js-cookie";

export default {
  data () {
    return {
      userLogged:false,
      id_patient:'',
      patient:'',
      aux:[],
      allergiesSelected:[],
      diseaseSelected:[],
      surgerySelected:[],
      allergies:[],
      diseases:[],
      surgeries:[],
      allergiesSelectedAux:[],
      diseaseSelectedAux:[],
      surgerySelectedAux:[],
      allergiesOriginal:[],
      diseasesOriginal:[],
      surgeriesOriginal:[],
      differenceAl:[],
      differenceDi:[],
      differenceSu:[],
      isUpdating: false,
      allergy:'',
    }
  },
  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    },
  },
  methods: {
    initialize(){
      this.allergiesSelected.splice(0,this.allergiesSelected.length);
      console.log(this.allergiesSelected)
      this.diseaseSelected.splice(0,this.diseaseSelected.length);
      this.surgerySelected.splice(0,this.surgerySelected.length);

      axios.get("http://127.0.0.1:8000/allergy")
          .then((response)=>{
            this.allergies=response.data
          })
      axios.get("http://127.0.0.1:8000/chronicdisease")
          .then((response)=>{
            this.diseases=response.data
          })
      axios.get("http://127.0.0.1:8000/surgery")
          .then((response)=>{
            this.surgeries=response.data
          })
      this.user= Cookies.get('userLogged');
      if (this.user==null){
        this.userLogged=false
      }
      else {
        this.userLogged = true
        let aux = JSON.parse(this.user)
        console.log(aux['role'])
        if (aux['role'] == '2') {
          this.patient=true;
          axios.get("http://127.0.0.1:8000/patient/user/"+aux['id'])
              .then((response)=>{
                this.id_patient=response.data.id
                axios.get("http://127.0.0.1:8000/patient/allergy/"+this.id_patient)
                    .then((response)=>{
                      this.allergiesSelectedAux=response.data;
                      this.allergiesSelected.splice(0,this.allergiesSelected.length);
                      (this.allergiesSelectedAux.length)? this.allergiesSelectedAux.forEach(element=>this.allergiesSelected.push(element.id)): null;
                      this.allergiesOriginal =this.allergiesSelected.slice();
                      Object.freeze(this.allergiesOriginal)
                      console.log(this.allergiesOriginal)
                      console.log(this.allergiesSelected)
                    })
                axios.get("http://127.0.0.1:8000/patient/disease/"+this.id_patient)
                    .then((response)=>{
                      this.diseaseSelectedAux=response.data;
                      this.diseaseSelected.splice(0,this.diseaseSelected.length);
                      (this.diseaseSelectedAux.length)?this.diseaseSelectedAux.forEach(element=>this.diseaseSelected.push(element.id)):null;
                      this.diseasesOriginal=this.diseaseSelected.slice();
                      Object.freeze(this.diseasesOriginal)
                    })
                axios.get("http://127.0.0.1:8000/patient/surgery/"+this.id_patient)
                    .then((response)=>{
                      this.surgerySelectedAux=response.data;
                      this.surgerySelected.splice(0,this.surgerySelected.length);
                      (this.surgerySelectedAux.length)?this.surgerySelectedAux.forEach(element=>this.surgerySelected.push(element.id)):null;
                      this.surgeriesOriginal=this.surgerySelected.slice();
                      Object.freeze(this.surgeriesOriginal)
                    });
              });
        }
      }

    },
    remove1 (item) {
      const index = this.allergiesSelected.indexOf(item.id)
      if (index >= 0) this.allergiesSelected.splice(index, 1)

    },
    remove2 (item) {
      const index = this.diseaseSelected.indexOf(item.id)
      if (index >= 0) this.diseaseSelected.splice(index, 1)
    },
    remove3 (item) {
      const index = this.surgerySelected.indexOf(item.id)
      if (index >= 0) this.surgerySelected.splice(index, 1)
    },
    onSubmit(id){
      this.isUpdating=true;

      if (this.allergiesOriginal.length!=""){
        this.differenceAl = this.allergiesOriginal.filter(element => !this.allergiesSelected.includes(element));
        console.log(this.differenceAl);
      }
      if (this.diseasesOriginal.length!=""){
        this.differenceDi = this.diseasesOriginal.filter(element => !this.diseaseSelected.includes(element));
        console.log(this.differenceDi);
      }
      if (this.surgeriesOriginal.length!=""){
        this.differenceSu = this.surgeriesOriginal.filter(element => !this.surgerySelected.includes(element));
        console.log(this.differenceSu);
      }

      if (this.differenceAl.length!=""||this.differenceDi.length!=""||this.differenceSu.length!=""){
        this.deleteClinicHistory(id);
      }
      else {
        this.saveChanges(id);
      }

    },
    deleteClinicHistory(id){

      if (this.differenceAl.length!=""){
        this.differenceAl.forEach(element=>{
          axios
              .delete('http://127.0.0.1:8000/patient/'+this.id_patient+'/allergy/'+element)
              .then((response) => {
                console.log(response.data);
                this.initialize();
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
      }
      if (this.differenceDi.length!=""){
        this.differenceDi.forEach(element=>{
          axios
              .delete('http://127.0.0.1:8000/patient/'+this.id_patient+'/disease/'+element)
              .then((response) => {
                console.log(response.data);
                this.initialize();
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
      }
      if (this.differenceSu.length!=""){
        this.differenceSu.forEach(element=>{
          axios
              .delete('http://127.0.0.1:8000/patient/'+this.id_patient+'/surgery/'+element)
              .then((response) => {
                console.log(response.data);
                this.initialize();
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
      }
      this.saveChanges(id);
    },
    saveChanges(id){
      if (this.allergiesSelected.length!=""){
        console.log("envia allergy")
        this.allergiesSelected.forEach(function(value, key){
          axios.get("http://127.0.0.1:8000/patient/allergy/"+id+"/"+value)
              .then((response)=>{
                let aux=response.data
                if(Object.keys(aux).length === 0){
                  console.log("key"+key)
                  const formDataAllergy = new FormData()
                  formDataAllergy.append('idPatient', id)
                  formDataAllergy.append('idAllergy', value)
                  var object = {};
                  formDataAllergy.forEach(function(value, key){
                    object[key] = value;
                  });
                  var json = JSON.stringify(object);
                  axios.post("http://127.0.0.1:8000/patientallergy",json
                  ).then(response => {
                    console.log(response.data)

                  })
                  console.log(json);
                }
              });
        });
      }
      if (this.diseaseSelected.length!="") {
        console.log("envia disease")
        this.diseaseSelected.forEach(function (value, key) {
          axios.get("http://127.0.0.1:8000/patient/disease/"+id+"/"+value)
              .then((response)=>{
                let aux=response.data
                if(Object.keys(aux).length === 0){
                  console.log("key" + key)
                  const formDataDisease = new FormData()
                  formDataDisease.append('idPatient', id)
                  formDataDisease.append('idDisease', value)
                  var object = {};
                  formDataDisease.forEach(function (value, key) {
                    object[key] = value;
                  });
                  var json = JSON.stringify(object);
                  axios.post("http://127.0.0.1:8000/patientdisease", json
                  ).then(response => {
                    console.log(response.data)

                  })
                  console.log(json);
                }
              });
        });

      }
      if (this.surgerySelected.length!="") {
        console.log("envia surgery")
        this.surgerySelected.forEach(function (value, key) {
          axios.get("http://127.0.0.1:8000/patient/surgery/"+id+"/"+value)
              .then((response)=>{
                let aux=response.data
                if(Object.keys(aux).length === 0){
                  console.log("key" + key)
                  const formDataSurgery = new FormData()
                  formDataSurgery.append('idPatient', id)
                  formDataSurgery.append('idSurgery', value)
                  var object = {};
                  formDataSurgery.forEach(function (value, key) {
                    object[key] = value;
                  });
                  var json = JSON.stringify(object);
                  axios.post("http://127.0.0.1:8000/patientsurgery", json
                  ).then(response => {
                    console.log(response.data)
                  })
                  console.log(json);
                }
              });
        });
      }
    }
  },
  mounted() {
    this.initialize()
  },
  created() {
    //this.initialize()
  }
}
</script>

<style>

</style>