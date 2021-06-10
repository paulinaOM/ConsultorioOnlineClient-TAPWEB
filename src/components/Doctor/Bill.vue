<template>
  <v-app>
    <div class="container">

      <v-toolbar flat>
        <v-toolbar-title>Generar Factura</v-toolbar-title>
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
              <span class="headline">Agregar concepto</span>
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
                        v-model="editedItem.id_service"
                        :items="services"
                        item-text="description"
                        item-value="id_service"
                        dense
                        filled
                        label="Descripcion"
                        @change="setServiceProperties(editedItem.id_service)"
                    >
                      <template v-slot:selection="data">
                        {{ data.item.description }}
                      </template>

                      <template v-slot:item="data">
                        <v-list-item-content>
                          <v-list-item-title v-html="data.item.description"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-autocomplete>
                    <v-text-field
                        v-show="false"
                        v-model="editedItem.id_service"
                    ></v-text-field>
                    <v-text-field
                        v-show="false"
                        v-model="editedItem.description"
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

      <v-card v-for="service in servicesProvided" v-bind:key="service.id" class="serviceItem">
        <v-card-subtitle class="font-weight-light blue-grey white--text">
          {{ service.description}}
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
                v-model="service.cost"
                label="Costo"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-btn
          v-if="servicesProvided.length>0"
          color="cyan"
          dark
          class="mb-2"
          @click="generatePDF"
      >
        Generar
      </v-btn>
    </div>
    <div style="visibility: hidden">
      <div id="documento" style="font-family: 'Roboto', sans-serif; font-size: 12px; width: 500px;">
        <table class="table table-hover" style="size: A4">
          <thead>
          <tr>
            <th scope="col">Descripción</th>
            <th scope="col">Total</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="service in servicesProvided"  :key="service.id">
            <td>{{service.description}}</td>
            <td>{{service.cost}}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>{{total}}.00</td>
          </tr>
          </tbody>
        </table>
      </div></div>
  </v-app>
</template>

<script>
import axios from "axios";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import Cookies from "js-cookie";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    patient_name:'',
    doctor_name:'',
    billingAddress:'',

    total:0,

    id_patient:'',
    services:[],
    servicesProvided: [],

    id_doctor:'',
    id_consultation: '',

    editedItem: {
      id_doctor: '',
      id_service: "",
      description: "",
      cost: 0,
    },

    defaultItem: {
      id_doctor: '',
      id_service: "",
      description: "",
      cost: 0,
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
                axios.post( 'http://127.0.0.1:8000/medicalconsultation/update/'+this.id_consultation+'/'+this.id_doctor)
                    .then(function(){
                      console.log('SUCCESS!! UPDATE CONSULTATION ID_DOCTOR');

                    })
                    .catch(function(error){
                      console.log(error);
                      console.log('FAILURE!! UPDATE CONSULTATION ID_DOCTOR');
                    });
                axios
                    .get("http://127.0.0.1:8000/services/doctor/"+this.id_doctor)
                    .then((response) => {
                      console.log(response.data);
                      this.services = response.data;

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
                      this.doctor_name=response.data.doctor_name
                      axios.get("http://127.0.0.1:8000/taxdata/patient/"+this.id_patient)
                          .then((response2)=>{
                            this.aux=response2.data
                            if(Object.keys(this.aux).length !== 0){
                              this.billingAddress=response2.data.billing_address;
                            }
                          });
                    });
              });
        }
      }

    },
    sendMail(){
      console.log(this.id_consultation);
      let data = {
        id_consultation: this.id_consultation,
      };
      let json = JSON.stringify(data);
      console.log(json);

      axios.post( 'http://127.0.0.1:8000/email/bill', json)
          .then((response) =>{
            console.log('SUCCESS!! SEND BILL' + response);

          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! SEND BILL' + json);
          });
    },
    setServiceProperties(idService){
      console.log(idService);
      axios
          .get("http://127.0.0.1:8000/service/"+idService+"/doctor/"+this.id_doctor)
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
      this.editedIndex = this.servicesProvided.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.servicesProvided.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.servicesProvided.splice(this.editedIndex, 1)
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
      this.servicesProvided.push(this.editedItem);
      this.close();
    },

    generatePDF(){
      this.servicesProvided.forEach(element=>this.total=Number(this.total)+Number(element.cost));
      var id_con=this.id_consultation;
      var doc = new jsPDF('p', 'pt');
       doc.text('Factura', 30, 20);
       doc.text('Nombre emisor: '+this.doctor_name, 30, 40);
       doc.text('Nombre receptor: '+this.patient_name, 30, 60);
       doc.text('Domicilio de facturación: '+this.billingAddress, 30, 80);
      doc.html(document.getElementById('documento'),{callback: function (doc) {
          //doc.save('a1.pdf');
          let pdf =btoa(doc.output());
          let formDataFile = new FormData();

          formDataFile.append('file', pdf);
          formDataFile.append('id_consultation',id_con);

          /*Make the request to the POST URL*/
          axios.post( 'http://127.0.0.1:8000/bill', formDataFile,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
          ).then(function(){
            console.log('SUCCESS!! STORAGE FILE');
            console.log(formDataFile);

            let data = {
              id_consultation: id_con,
            };
            let json = JSON.stringify(data);
            console.log(json);

            axios.post( 'http://127.0.0.1:8000/email/bill', json)
                .then((response) =>{
                  console.log('SUCCESS!! SEND BILL' + response);

                })
                .catch(function(error){
                  console.log(error);
                  console.log('FAILURE!! SEND BILL' + json);
                });

          })
              .catch(function(error){
                console.log(formDataFile);
                console.log(error);
                console.log('FAILURE!! STORAGE FILE');
              });

        },x:30,y:100});
      this.updateStatus(this.id_consultation);

    },
    updateStatus(id){
      axios
          .put("http://127.0.0.1:8000/medicalconsultation/updatestatus/"+id+"/2")
          .then((response) => {
            console.log(response.data);
            console.log('SUCCESS!! STATUS UPDATE ');

            location.href ="/priorConsultationDoctor"
          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! STATUS UPDATE ');
          });
      //this.sendMail();
    }

  },
}
</script>


<style>
.serviceItem{
  margin: 20px;

}
.compact-form {
  transform: scale(0.775);
  transform-origin: left;
}


</style>