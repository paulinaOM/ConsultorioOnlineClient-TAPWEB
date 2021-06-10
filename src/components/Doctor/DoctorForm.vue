
<template>
  <div class="container" style="margin-left:6%; margin-right: 10%">
    <br>
    <div class="row">
      <div class="col-md-8 order-md-1">
        <h4 class="mb-3">Nuevo Médico</h4>
      </div>
    </div>
    <form method="post" @submit.prevent="onSubmit">
      <div class="form-group">
        <label >Nombre</label>
        <input v-model="name" type="text" class="form-control" id="inputName" placeholder="Name">
      </div>
      <div class="form-group">
        <label for="inputLastname">Apellidos</label>
        <input v-model="lastname" type="text" class="form-control" id="inputLastname" placeholder="Apellidos">
      </div>
      <div class="form-group">
        <label for="inputAddress">Dirección</label>
        <input v-model="address" type="text" class="form-control" id="inputAddress" placeholder="Dirección">
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="inputPhone">Teléfono móvil</label>
          <input v-model="mobile_phone" class="form-control" id="inputPhone" placeholder="Teléfono móvil">
        </div>
        <div class="form-group col-md-6">
          <label for="inputLicense">Cédula profesional</label>
          <input type="text" v-model="license" class="form-control" id="inputLicense" placeholder="Cédula profesional">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="inputEmail">Email</label>
          <input type="email" class="form-control" v-model="email" id="inputEmail" placeholder="Email">
        </div>
        <div class="form-group col-md-6">
          <label>Especialidad</label>
          <select class="form-control" v-model="id_speciality">
            <option value="" disabled selected hidden>Selecciona tu especialidad</option>
            <option v-for="option in specialities"  :key="option.id" v-bind:value="option.id">
              {{ option.description }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="inputCity">Ciudad</label>
          <input type="text" class="form-control" id="inputCity" v-model="city">
        </div>
        <div class="form-group col-md-4">
          <label for="inputState">Estado</label>
          <input type="text" class="form-control" id="inputState" v-model="state">
        </div>
        <div class="form-group col-md-4">
          <label for="inputCountry">País</label>
          <input type="text" v-model="country" class="form-control" id="inputCountry">
        </div>
        <input type="number" class="form-control" v-model="id_user" id="inputUser">
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
  </div>

</template>

<script>
import axios from "axios";
export default {
  data(){
    return{
      name:'',
      lastname:'',
      address:'',
      city:'',
      state:'',
      country:'',
      license:'',
      mobile_phone:'',
      email:'',
      id_user:'',
      id_speciality:'',
      isLoading:false,
      specialities:''

    }
  },
  mounted() {
    axios.get("http://127.0.0.1:8000/speciality")
        .then((response)=>{
          this.specialities=response.data
        })
    axios.get("http://127.0.0.1:8000/userlast")
        .then((response)=>{
          this.id_user=response.data.id
        })
  },
  methods:{
    onSubmit(){
      this.isLoading = true
      this.sendCreateDoctor()

    },
    sendCreateDoctor(){

      if (this.name==""||this.lastname==""||this.address==""||this.email==""||this.country==""||this.license==""||this.city==""
          ||this.mobile_phone==""||this.state=="") {
        alert("Completa todos los campos")
      }
      else {

        const formData = new FormData()
        formData.append('name', this.name)
        formData.append('lastname', this.lastname)
        formData.append('mobile_phone',this.mobile_phone)
        formData.append('email', this.email)
        formData.append('address', this.address)
        formData.append('city', this.city)
        formData.append('state', this.state)
        formData.append('country', this.country)
        formData.append('license',this.license)
        formData.append('id_speciality',this.id_speciality)
        formData.append('id_user', this.id_user)


        var object = {};
        formData.forEach(function(value, key){
          object[key] = value;
        });
        var json = JSON.stringify(object);

        axios.post("http://127.0.0.1:8000/doctor",json
        ).then(response => {
          console.log(response.data)
          this.isLoading = false
          location.href ="/login"
        })
            .catch(error => {
              alert(error)
              console.log(json)
              this.isLoading = false
              alert(formData.getAll('name')+formData.getAll('lastname')+formData.getAll('address')+
                  formData.getAll('email')+formData.getAll('country')+formData.getAll('city')+formData.getAll('state')+
                  formData.getAll('id_user')+formData.getAll('license')+formData.getAll('mobile_phone')+formData.getAll('id_speciality'))
            })


      }

    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#inputUser{
  display: none;
}

</style>
