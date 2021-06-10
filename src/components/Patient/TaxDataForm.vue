
<template>
  <div v-if="userLogged" class="container" style="margin-left:6%; margin-right: 10%">
    <div v-if="patient" >
    <br>
    <div class="row">
      <div class="col-md-8 order-md-1">
        <h4 class="mb-3">Datos de facturación</h4>
      </div>
    </div>
    <form method="post" @submit.prevent="onSubmit">
      <div class="form-group">
        <label >Nombre</label>
        <input v-model="name" type="text" class="form-control" id="inputName" placeholder="Name" readonly>
        <input v-model="id_patient" type="text" class="form-control" id="inputPatient" >
      </div>
      <div class="form-group">
        <label for="inputBillingAddress">Domicilio de Facturación</label>
        <input v-model="billingAddress" type="text" class="form-control" id="inputBillingAddress" placeholder="Domicilio de facturación" required>
      </div>
      <div class="form-group">
        <label for="inputShippingDate">Domicilio de envío</label>
        <input v-model="shippingAddress" type="text" class="form-control" id="inputShippingDate" placeholder="Domicilio de envío" required>
      </div>
        <div class="form-group">
          <label for="inputPayment">Tipo de pago</label>
          <select class="form-control" v-model="id_payment" id="inputPayment">
            <option value="" disabled selected hidden>Selecciona un tipo de pago</option>
            <option v-for="option in payment"  :key="option.id" v-bind:value="option.id" >
              {{ option.description }}
            </option>
          </select>
        </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
    </div>
    <div v-else class="alert alert-danger" role="alert">
      No tienes permiso para acceder a este contenido. <a href="/home" class="alert-link">Ir a principal</a>.
    </div>
  </div>

</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {

  data(){
    return{
      user:{},
      name:'',
      id_patient:'',
      billingAddress:'',
      shippingAddress:'',
      id_payment:'',
      payment:'',
      userLogged:false,
      patient:false,
      submit:true

    }
  },
  created() {
    this.userLoggedF()
  },
  mounted() {

    axios.get("http://127.0.0.1:8000/payment")
        .then((response)=>{
          this.payment=response.data
        })
  },
  methods:{
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
                this.name=response.data.name+response.data.lastname
                this.id_patient=response.data.id
                axios.get("http://127.0.0.1:8000/taxdata/patient/"+this.id_patient)
                    .then((response2)=>{
                      this.aux=response2.data
                      if(Object.keys(this.aux).length !== 0){
                        this.submit=false;
                        this.shippingAddress=response2.data.shipping_date;
                        this.billingAddress=response2.data.billing_address;
                        this.id_payment=response2.data.id_payment
                      }
                    });
              });

        }
      }
    },
    onSubmit(){
      this.isLoading = true
      if(this.submit){
        this.sendCreateTaxData()
      }
      else {
        this.sendUpdateTaxData()
      }


    },
    sendCreateTaxData(){

      if (this.billingAddress==""||this.shippingAddress==""||this.id_payment=="") {
        alert("Completa todos los campos")
      }
      else {
        const formData = new FormData()
        formData.append('idPatient', this.id_patient)
        formData.append('billingAddress', this.billingAddress)
        formData.append('shippingDate',this.shippingAddress)
        formData.append('idPayment', this.id_payment)

        var object = {};
        formData.forEach(function(value, key){
          object[key] = value;
        });
        var json = JSON.stringify(object);

        axios.post("http://127.0.0.1:8000/taxdata",json
        ).then(response => {
          console.log(response.data)
          this.isLoading = false
          location.href ="/taxData"
        })
            .catch(error => {
              alert(error)
              console.log(json)
              this.isLoading = false
            })
      }

    },
    sendUpdateTaxData(){

      if (this.billingAddress==""||this.shippingAddress==""||this.id_payment=="") {
        alert("Completa todos los campos")
      }
      else {
        const formData = new FormData()
        formData.append('id_patient', this.id_patient)
        formData.append('billing_address', this.billingAddress)
        formData.append('shipping_date',this.shippingAddress)
        formData.append('id_payment', this.id_payment)

        var object = {};
        formData.forEach(function(value, key){
          object[key] = value;
        });
        var json = JSON.stringify(object);

        axios.post("http://127.0.0.1:8000/taxdata/update",json,
        ).then(response => {
          console.log(response.data)
          this.isLoading = false
          location.href ="/taxData"
        })
            .catch(error => {
              alert(error)
              console.log(json)
              this.isLoading = false
            })
      }

    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#inputPatient{
  display: none;
}

</style>
