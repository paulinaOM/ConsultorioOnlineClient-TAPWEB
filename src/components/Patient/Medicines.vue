<template>
  <v-app>
    <template>
      <v-container fluid>
        <div>
          <div class="right-position">
            <v-btn
                v-if="seeProducts"
                small
                dark
                color="indigo"
                @click="goToCart()"
            >
              Ver carrito de compras
            </v-btn>
            <v-btn
                v-else
                small
                dark
                color="indigo"
                @click="goToProducts()"
            >
              Volver a productos
            </v-btn>
          </div>
          <div>
            <h3>{{ pageTitle }}</h3>
          </div>
        </div>

        <div v-if="seeProducts">
          <v-data-iterator
              :items="medicines"
              :search="search"
          >
            <template v-slot:header>
              <v-toolbar
                  dark
                  color="blue darken-3"
                  class="mb-1"
              >
                <v-text-field
                    v-model="search"
                    clearable
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search"
                ></v-text-field>
              </v-toolbar>
            </template>

            <template v-slot:default="props">
              <v-row>
                <v-col
                    v-for="item in props.items"
                    :key="item.name"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                >
                  <v-card>
                    <v-img
                        height="100"
                        :src="item.image"
                    ></v-img>

                    <v-card-subtitle class="subheading font-weight-bold">
                      {{ item.name }}
                    </v-card-subtitle>

                    <v-list dense>
                      <v-list-item
                          v-for="(key, index) in filteredKeys"
                          :key="index"
                      >
                        <v-list-item-content :class="'blue--text compact-form'">
                          {{ key.text }}:
                        </v-list-item-content>
                        <v-list-item-content
                            class="align-end compact-form"

                        >
                          {{ item[key.value.toLowerCase()] }}
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-card-actions>
                    <v-btn
                        outlined
                        block
                        small
                        color="indigo"
                        @click="addToCart(item)"
                    >
                      Agregar al carrito
                    </v-btn>
                    </v-card-actions>


                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </div>
        <div v-else>
          <v-data-table
              :headers="headers"
              :items="cart"
              class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-dialog v-model="dialogDelete" max-width="320px">
                  <v-card>
                    <v-card-title>¿Está seguro de eliminar este medicamento?</v-card-title>
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
            <template v-slot:item.quantity="props">
              <v-edit-dialog
                  :return-value.sync="props.item.quantity"
                  large
                  persistent
                  @save="saveNewQuantity(props.item)"
                  @cancel="cancelNewQuantity"
              >
                <div>{{ props.item.quantity }}</div>
                <template v-slot:input>
                  <div class="mt-4 title">
                    Actualizar cantidad
                  </div>
                  <v-text-field
                      v-model="props.item.quantity"
                      label="Editar"
                      single-line
                      counter
                      autofocus
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>

            <template v-slot:item.image="props">
              <v-img
                  :src="props.item.image"
                  width="100"
              ></v-img>
            </template>
          </v-data-table>
          <v-spacer></v-spacer>
          <div v-if="cart.length>0" class="right-position">
            <p class="my-4 subtitle-1">Total: $ {{total}} </p>
            <v-btn
                color="cyan"
                dark
                class="mb-2"
                @click="generatePDF"
            >
              Generar
            </v-btn>
          </div>
        </div>
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
              x
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </template>
    <div style="display: none">
      <div id="documento" style="font-family: 'Roboto', sans-serif; font-size: 10px; width: 300px;">
        <table class="table table-hover" style="size: A4">
          <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Tipo</th>
            <th scope="col">Sustancia activa</th>
            <th scope="col">Precio unitario</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="car in cart"  :key="car.id">
            <td>{{car.name}}</td>
            <td>{{car.type}}</td>
            <td>{{car.substance}}</td>
            <td>${{car.price}}</td>
            <td>{{car.quantity}}</td>
            <td>${{car.subtotal}}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><b>Total</b></td>
            <td>${{total}}</td>
          </tr>
          </tbody>
        </table>
      </div></div>
  </v-app>
</template>

<script>
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {jsPDF} from "jspdf";
import axios from "axios";

export default {
  name: "Medicines",
  data(){
    return{
      api:null,
      idPatient: 1,
      ticketId:-1,
      dateSale:null,
      seeProducts: true,
      search:'',
      medicineItems: Number,
      dialogDelete: false,
      snackColor : '',
      snackText : '',
      snack : false,
      total:0,
      cart:[],
      medicines: [],
      keys: [
        { text:'Nombre', value: 'name'},
        { text:'Tipo', value: 'type'},
        { text:'Sustancia Activa', value: 'substance'},
        { text:'Laboratorio', value: 'laboratory'},
        { text:'Categoría', value: 'category'},
        { text:'Precio', value: 'price'},
      ],
      headers: [
        { text: '', value: 'actions', sortable: false },
        {text: '', value: 'image'},
        { text:'Nombre', value: 'name'},
        { text:'Precio', value: 'price'},
        { text:'Cantidad', value: 'quantity'},
        { text:'Subtotal', value: 'subtotal'},
      ],
    }
  },
  computed: {
    filteredKeys () {
      return this.keys.filter(key => key.text !== 'Nombre');
    },
    pageTitle () {
      return (this.seeProducts)? "Medicamentos":"Carrito de compras";
    },
  },
  watch: {
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  methods:{
    initialize(){
      this.api = new WooCommerceRestApi({
        url: "https://dev-site-itc-lince.pantheonsite.io/",
        consumerKey: "ck_ff78668aef5393b63aa43db15e8662ab9d1e8787",
        consumerSecret: "cs_d516864551a9235d7084f277872975613a096876",
        version: "wc/v3"
      });
      this.getProducts();
    },
    getProducts(){
      this.api.get("products", {
        per_page: 50, // 50 products per page
      })
          .then((response) => {
            // Successful request
            console.log("Response Data:", response.data);
            console.log("Total of items:", response.headers['x-wp-total']);
            this.medicineItems = response.headers['x-wp-total'];

            this.generateMedicine(response.data);
          })
          .catch((error) => {
            // Invalid request, for 4xx and 5xx statuses
            console.log("Response Status:", error.response.status);
            console.log("Response Headers:", error.response.headers);
            console.log("Response Data:", error.response.data);
          });
    },
    generateMedicine(medicineInfo){
      let i=0;
      for (i=0; i< medicineInfo.length; i++){
        const name = medicineInfo[i].name;
        const price = medicineInfo[i].price;

        const categories = medicineInfo[i].categories;
        const images = medicineInfo[i].images;
        for (var j = 0; j < categories.length; j++) {
          var category = categories[j].name;
          var image = images[j].src;
        }

        this.medicines.push({
          'name':name,
          'price':price,
          'category':category,
          'image': image,
          'type':medicineInfo[i].attributes[0].options[0],
          'substance':medicineInfo[i].attributes[1].options[0],
          'laboratory':medicineInfo[i].attributes[2].options[0],
        })
      }
      console.log("Medicinas:", this.medicines);
    },
    addToCart(medicine){
      this.cart.push({
        'name':medicine['name'],
        'price':medicine['price'],
        'category':medicine['category'],
        'image': medicine['image'],
        'type':medicine['type'],
        'substance':medicine['substance'],
        'laboratory':medicine['laboratory'],
        'quantity': 1,
        'subtotal':medicine['price'],
      });

      this.snackColor = 'primary';
      this.snackText = 'Se ha agregado al carrito de compras';
      this.snack = true;

      this.calculateTotal();
    },
    goToCart(){
      this.seeProducts=false;
    },
    goToProducts(){
      this.seeProducts=true;
    },
    deleteItem (item) {
      this.editedIndex = this.cart.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log("Se eliminara:",item);
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      //Eliminar item del array splice
      this.cart.splice(this.editedIndex, 1)
      console.log("Cart despues de eliminar",this.cart)
      this.closeDelete();
      this.calculateTotal();
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      });
    },
    saveNewQuantity (item) {
      console.log("Item 1 nueva cantidad",item)
      this.editedIndex = this.cart.indexOf(item)

      item.subtotal = item.price * item.quantity
      console.log("Item 2 nueva cantidad y subtotal",item)

      this.editedItem = Object.assign({}, item)
      if (this.editedIndex > -1) {
        Object.assign(this.cart[this.editedIndex], this.editedItem)
      }
      console.log("Array subtotal modificado",this.cart);
      this.calculateTotal();
    },
    cancelNewQuantity () {
      console.log("Cancelado nueva cantidad")
    },
    calculateTotal(){
      let auxTotal =0;
      this.cart.forEach(medicine => auxTotal+= parseFloat(medicine.subtotal));
      this.total = auxTotal;
    },
    generatePDF(){
      this.snack = true
      this.snackColor = 'primary'
      this.snackText = 'Los medicamentos serán enviados a su domicilio '

      this.dateSale= new Date();


      var id_pat=this.idPatient;
      var doc = new jsPDF('p', 'pt');
      doc.text('Medicamentos adquiridos', 30, 30);
      doc.text('Fecha: '+this.dateSale.toDateString(), 30, 50);

      doc.html(document.getElementById('documento'),{callback: function (doc) {
          doc.save('a1.pdf');
          let pdf =btoa(doc.output());
          let formDataFile = new FormData();

          formDataFile.append('file', pdf);
          formDataFile.append('id_patient',id_pat);

          axios.post( 'http://127.0.0.1:8000/ticket', formDataFile,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
          ).then(function(){
            console.log('SUCCESS!! STORAGE FILE');
            console.log(formDataFile);
          })
              .catch(function(error){
                console.log(formDataFile);
                console.log(error);
                console.log('FAILURE!! STORAGE FILE');
              });

        },x:30,y:70});
      this.getLastTicket();
    },
    getLastTicket(){
      axios
          .get("http://127.0.0.1:8000/ticket/last")
          .then((response) => {
            console.log(response.data);
            this.ticketId= response.data;
            console.log(this.ticketId);
            this.sendMail();
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
    sendMail(){
      let data = {
        id_patient: this.idPatient,
        id_ticket: this.ticketId,
      };
      let json = JSON.stringify(data);
      console.log(json);

      axios.post( 'http://127.0.0.1:8000/email/ticket', json)
          .then((response) =>{
            console.log('SUCCESS!! SEND TICKET' + response);
            location.href ="/salesHistory"

          })
          .catch(function(error){
            console.log(error);
            console.log('FAILURE!! SEND TICKET' + json);
          });
    }
  },
  mounted() {
    this.initialize();
  }
}
</script>

<style>
.compact-form {
  transform: scale(0.775);
  transform-origin: left;
}

.right-position{
  float: right;
}

</style>