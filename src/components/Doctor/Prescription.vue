<template>
  <v-app v-if="doctor">
    <div class="container">
        <v-toolbar flat>
          <v-toolbar-title>Receta médica</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          ></v-divider>
          <v-spacer></v-spacer>
        <v-dialog
            v-model="dialog"
            max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="mx-2"
                fab
                dark
                small
                color="cyan"
                v-bind="attrs"
                v-on="on"
            >
              <v-icon>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Recetar medicamento</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      sm="6"
                      md="6"
                  >
                    <v-autocomplete
                        v-model="editedItem.id"
                        :items="medicines"
                        item-text="name"
                        item-value="id"
                        dense
                        filled
                        label="Nombre"
                        @change="setMedicineProperties(editedItem.id)"
                    >
                      <template v-slot:selection="data">
                        {{ data.item.name }}
                      </template>

                      <template v-slot:item="data">
                        <v-list-item-content>
                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-autocomplete>
                    <v-text-field
                        v-show="false"
                        v-model="editedItem.name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="6"
                  >
                    <v-text-field
                        readonly
                        v-model="editedItem.type"
                        label="Tipo"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                      cols="12"
                      sm="6"
                      md="6"
                  >
                    <v-text-field
                        readonly
                        v-model="editedItem.substance"
                        label="Sustancia"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="6"
                  >
                    <v-text-field
                        readonly
                        v-model="editedItem.laboratory"
                        label="Laboratorio"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                    >
                      <v-text-field
                          v-model="editedItem.instructions"
                          label="Instrucciones"
                      ></v-text-field>

                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                    >
                      <v-text-field
                          readonly
                          v-model="editedItem.cost"
                          label="Costo"
                      ></v-text-field>
                    </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
              >
                Agregar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-toolbar>

    <v-card v-for="medicine in prescriptionMedicine" v-bind:key="medicine.id" class="medicineItem">
      <v-card-subtitle class="font-weight-light blue-grey white--text">
        {{ medicine.name+". "+medicine.substance +". "+medicine.type+". Laboratorio "+medicine.laboratory}}
      </v-card-subtitle>
      <v-row class="mx-0">
        <v-col
            cols="12"
            sm="6"
            md="8"
        >
          <v-text-field
              height="20"
              class="compact-form"
              v-model="medicine.instructions"
              label="Instrucciones"
          ></v-text-field>
        </v-col>
        <v-col
            cols="12"
            sm="6"
            md="4"
        >
          <v-text-field
              readonly
              height="20"
              class="compact-form"
              v-model="medicine.cost"
              label="Costo"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <v-btn
        v-if="prescriptionMedicine.length>0"
        color="cyan"
        dark
        class="mb-2"
        @click="generatePDF(id_consultation)"
    >
      Generar
    </v-btn>
      <div style="visibility: hidden">
      <div id="documento" style="font-family: 'Roboto', sans-serif; font-size: 12px">
        <table class="table table-hover">
          <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Tipo</th>
            <th scope="col">Sustancia activa</th>
            <th scope="col">Laboratorio</th>
            <th scope="col">Instrucciones</th>
            <th scope="col">Precio</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="medicine in prescriptionMedicine"  :key="medicine.id">
            <td>{{medicine.name}}</td>
            <td>{{medicine.type}}</td>
            <td>{{medicine.substance}}</td>
            <td>{{medicine.laboratory}}</td>
            <td>{{medicine.instructions}}</td>
            <td>{{medicine.cost}}</td>
          </tr>
          </tbody>
        </table>
      </div></div>
    </div>

  </v-app>
  <div v-else class="alert alert-danger" role="alert">
    No tienes permiso para acceder a este contenido. <a href="/home" class="alert-link">Ir a principal</a>.
  </div>
</template>

<script>

import axios from "axios";
import jsPDF from 'jspdf';
require("jspdf-autotable");

import Cookies from "js-cookie";

export default {
  data: () => ({

    id_doctor:'',
    patient_name:'',
    doctor_name:'',
    id_patient:'',
    doctor:false,
    userLogged:false,
    dialog: false,
    dialogDelete: false,

    medicines:[],
    prescriptionMedicine: [],

    id_consultation: '',

    editedItem: {
      name: '',
      type: "",
      substance: "",
      laboratory: "",
      cost: 0,
      instructions:"",
    },

    defaultItem: {
      name: '',
      type: "",
      substance: "",
      laboratory: "",
      cost: 0,
      instructions:"",
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    getBill(id){
      this.$router.push({
        name: "bill",
        params:{
          id: id,
        }
      });
    },
    initialize () {
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

                axios.get("http://127.0.0.1:8000/medicalconsultation/"+this.id_consultation)
                    .then((response)=>{
                      this.id_patient=response.data.id_patient
                      this.patient_name=response.data.patient_name
                      this.doctor_name=response.data.doctor_name
                    });
              });
        }
      }

      axios
          .get("http://127.0.0.1:8000/medicine")
          .then((response) => {
            console.log(response.data);
            this.medicines = response.data;

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
    setMedicineProperties(idMedicine){
      console.log(idMedicine);

      axios
          .get("http://127.0.0.1:8000/medicine/"+idMedicine)
          .then((response) => {
            console.log(response.data);
            this.editedItem = response.data;

            console.log(this.editedItem);

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
    editItem (item) {
      this.editedIndex = this.prescriptionMedicine.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.prescriptionMedicine.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.prescriptionMedicine.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      console.log(this.editedItem);
      this.prescriptionMedicine.push(this.editedItem);
      this.close();
    },
    generatePDF(id){
      var doc = new jsPDF('p', 'pt');
      doc.text("Receta Médica",30,20);
      doc.text("Especialista: "+this.doctor_name,30,40);
      doc.text("Paciente: "+this.patient_name,30,60);
      var id_con=this.id_consultation;
      doc.html(document.getElementById('documento'),{callback: function (doc) {
          let formDataFile = new FormData();
          //doc.save('a1.pdf');
          let pdf =btoa(doc.output());
          console.log("btoa:"+pdf)
          formDataFile.append('file', pdf);
          formDataFile.append('id_consultation',id_con);
          /*Make the request to the POST URL*/
          axios.post( 'http://127.0.0.1:8000/prescription', formDataFile,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
          ).then(function(){
            console.log('SUCCESS!! STORAGE FILE');
            console.log(formDataFile);
            console.log('s'+id);


          })
              .catch(function(error){
                console.log(formDataFile);
                console.log(error);
                console.log('FAILURE!! STORAGE FILE');
              });

        },x:30,y:80});
        this.sendMail();
        this.getBill(id);
    },
    sendMail(){
      console.log(this.id_consultation);
      let data = {
        id_consultation: this.id_consultation,
      };
      let json = JSON.stringify(data);
      console.log(json);

      axios.post( 'http://127.0.0.1:8000/email/prescription', json)
          .then((response) =>{
            console.log('SUCCESS!! SEND PRESCRIPTION' + response);

          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! SEND PRESCRIPTION' + json);
          });
    }
  },
}
</script>


<style>
.medicineItem{
  margin: 20px;

}
.compact-form {
  transform: scale(0.775);
  transform-origin: left;
}


</style>