<template>
  <div class="container">
    <v-app v-if="doctor">
    <div>
      <v-data-table
          :headers="headers"
          :items="servicesByDoctor"
          class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
              flat
          >
            <v-toolbar-title>Servicios</v-toolbar-title>
            <v-divider
                class="mx-4"
                inset
                vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
                v-model="dialogNewDoctorService"
                max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="teal"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="serviceExists = true"
                >
                  Agregar
                </v-btn>

                <v-btn
                    color="teal"
                    dark
                    class="mb-2 btnNuevoServicio"
                    v-bind="attrs"
                    v-on="on"
                    @click="serviceExists = false"
                >
                  Nuevo
                </v-btn>
              </template>
              <v-card>
                <v-toolbar
                    color="teal"
                    dark
                >
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                          cols="12"
                          sm="8"
                          md="6"
                      >
                        <v-autocomplete
                            v-if="serviceExists"
                            v-model="editedItem.id_service"
                            :items="services"
                            item-text="description"
                            item-value="id"
                            dense
                            filled
                            label="Descripción"
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
                            v-else
                            required
                            v-model="editedItem.description"
                            label="Descripción"
                        ></v-text-field>
                      </v-col>
                      <v-col
                          cols="12"
                          sm="8"
                          md="6"
                      >
                        <v-text-field
                            v-model="editedItem.cost"
                            label="Costo"
                            required
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
                      v-if="serviceExists"
                      text
                      @click="saveNewDoctorService"
                  >
                    Guardar
                  </v-btn>
                  <v-btn
                      color="blue darken-1"
                      v-else
                      text
                      @click="saveNewService"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">¿Está seguro de eliminar este servicio?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
              class="ma-2"
              outlined
              small
              fab
              color="indigo"
              @click="deleteItem(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <v-btn
              color="primary"
              @click="initialize"
          >
            Reset
          </v-btn>
        </template>
        <template v-slot:item.cost="props">
          <v-edit-dialog
              :return-value.sync="props.item.cost"
              large
              persistent
              @save="saveNewCost(props.item)"
              @cancel="cancelNewCost"
          >
            <div>{{ props.item.cost }}</div>
            <template v-slot:input>
              <div class="mt-4 title">
                Actualizar costo
              </div>
              <v-text-field
                  v-model="props.item.cost"
                  label="Editar"
                  single-line
                  counter
                  autofocus
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
      </v-data-table>

      <v-snackbar
          v-model="snack"
          :timeout="3000"
          :color="snackColor"
      >
        {{ snackText }}

        <template v-slot:action="{ attrs }">
          <v-btn
              v-bind="attrs"
              text
              @click="snack = false"
          >
            X
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    </v-app>
    <div v-else class="alert alert-danger" role="alert">
      No tienes permiso para acceder a este contenido. <a href="/home" class="alert-link">Ir a principal</a>.
    </div>
  </div>

</template>


<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data: () => ({
    doctor:false,
    userLogged:false,
    serviceExists: true,
    snackColor: '',
    snack: false,
    snackText: '',
    dialogNewDoctorService: false,
    dialogDelete: false,
    headers: [
      {text: 'Descripción', value: 'description'},
      { text: 'Costo', value: 'cost' },
      { text: '', value: 'actions', sortable: false },
    ],
    services: [],
    servicesByDoctor:[],

    id_service: -1,


    editedItem: {
      id_service: null,
      description:null,
      id_doctor:'',
      cost: 0.0,
    },
    defaultItem: {
      id_service: null,
      description:null,
      id_doctor:'',
      cost: 0.0,
    },
  }),
  mounted() {
    this.userLoggedF()
  },
  computed: {
    formTitle () {
      return this.serviceExists ? 'Agregar a mis servicios':'Nuevo servicio'
    },
  },

  watch: {
    dialogNewDoctorService (val) {
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
    userLoggedF() {

      if (this.user==null){
        this.userLogged=false
      }
      else{
        this.userLogged=true
        let aux=JSON.parse(this.user)
        console.log(aux['role'])
        if(aux['role']=='1'){
          this.doctor=true;
          axios.get("http://127.0.0.1:8000/doctor/user/"+aux['id'])
              .then((response)=>{
                this.editedItem.id_doctor=response.data.id
                this.defaultItem.id_doctor=response.data.id
              });
        }
      }
    },
    initialize () {
      this.user= Cookies.get('userLogged');
      let aux=JSON.parse(this.user)
      axios.get("http://127.0.0.1:8000/doctor/user/"+aux['id'])
          .then((response)=>{
            this.editedItem.id_doctor=response.data.id
            axios
                .get("http://127.0.0.1:8000/services/doctor/"+this.editedItem.id_doctor)
                .then((response) => {
                  console.log(response.data);
                  this.servicesByDoctor = response.data;

                })
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
          .get("http://127.0.0.1:8000/service")
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
    },
    deleteItem (item) {
      this.editedItem = Object.assign({}, item)
      this.id_service = item.id;
      console.log(item.id_service);
      this.dialogDelete = true;
    },

    deleteItemConfirm () {
      this.closeDelete()
      axios
          .delete('http://127.0.0.1:8000/doctorService/'+this.id_service)
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

    },

    close () {
      this.dialogNewDoctorService = false
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    saveNewCost (item) {
      console.log(item.id);
      let json = JSON.stringify(item);
      this.snackColor = 'success';
      this.snackText = 'Costo actualizado';
      this.snack = true;

      axios.put( 'http://127.0.0.1:8000/doctorService/edit/'+item.id, json)
          .then(function(){
            console.log('SUCCESS!! UPDATE DOCTORSERVICE' + json);
          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! UPDATE DOCTORSERVICE' + json);
          });
    },
    cancelNewCost () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Cancelado'
    },
    saveNewService () {
      let json = JSON.stringify(this.editedItem);
      console.log(json);

      axios.post( 'http://127.0.0.1:8000/service', json)
          .then((response) =>{
            console.log('SUCCESS!! STORAGE SERVICE' + json);
            (response)? this.getLastIdService() : "";
          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! STORAGE SERVICE' + json);
          });
      this.close()
    },
    getLastIdService() {
      console.log("obtenemosid");
      axios
          .get("http://127.0.0.1:8000/services/last")
          .then((response) => {
            console.log(response.data);
            this.editedItem.id_service = response.data.id;
            console.log("Success GET LAST ID "+this.editedItem.id_service);

            this.saveNewDoctorService();

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
    saveNewDoctorService () {
      let json = JSON.stringify(this.editedItem);
      console.log(json)

      axios.post( 'http://127.0.0.1:8000/doctorService', json)
          .then(function(){
            console.log('SUCCESS!! STORAGE DOCTORSERVICE' + json);
          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! STORAGE DOCTORSERVICE' + json);
          });
      this.close();
      this.initialize();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
  },
}
</script>

<style>
.btnNuevoServicio{
  margin-right: 10px;
}
</style>