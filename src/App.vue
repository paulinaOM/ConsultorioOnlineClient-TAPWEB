<template>

  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="/home">Consultorio Online</a><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <router-link to="/home"><a class="nav-link">Home <span class="sr-only">(current)</span></a></router-link>
          </li>
          <li  v-if="doctor" class="nav-item active">
            <router-link to="/doctorService"><a class="nav-link">Servicios<span class="sr-only"></span></a></router-link>
          </li>
          <li class="nav-item dropdown" v-if="doctor">
            <a class="nav-link dropdown-toggle" href="#"  role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Consultas Médicas
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <router-link to="/consultationList"><a class="dropdown-item">Consultas pendientes</a></router-link>
              <router-link to="/priorConsultationDoctor"><a class="dropdown-item" href="#">Historial</a></router-link>
            </div>
          </li>
          <li class="nav-item active" v-if="patient">
            <router-link to="/clinicHistory"><a class="nav-link">Historia Clínica<span class="sr-only">(current)</span></a></router-link>
          </li>

          <li class="nav-item active">
            <router-link v-if="patient" to="/doctors"><a class="nav-link">Médicos</a></router-link>
          </li>

          <li class="nav-item dropdown" v-if="patient">
            <a class="nav-link dropdown-toggle" href="#"  role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Consultas Médicas
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <router-link to="/registerConsultation"><a class="dropdown-item">Nueva consulta</a></router-link>
              <router-link to="/priorConsultation"><a class="dropdown-item" href="#">Historial</a></router-link>
            </div>
          </li>
          <li class="nav-item dropdown" v-if="patient">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Facturas
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <router-link to="/taxData"><a class="dropdown-item">Datos de facturación</a></router-link>
              <router-link to="/billsHistory"><a class="dropdown-item" href="#">Historial</a></router-link>
            </div>
          </li>
          <li class="nav-item active">
            <router-link v-if="patient" to="/salesHistory"><a class="nav-link">Compras</a></router-link>
          </li>
          <li class="nav-item active">
            <router-link v-if="patient" to="/mapaCasosCOVID"><a class="nav-link">Casos COVID 19</a></router-link>
          </li>
          <li class="nav-item active">
            <router-link v-if="patient" to="/store"><a class="nav-link">Tienda</a></router-link>
          </li>
          <li class="nav-item active">
            <button class="nav-link" v-on:click="logout" v-if="userLogged" id="btnLogut">Logout</button>
            <router-link v-else to="/login"><a class="nav-link" >Login<span class="sr-only"></span></a></router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>

</template>

<script>
import Cookies from "js-cookie";
export default {
  data(){
    return{
      role:'',
      userLogged:false,
      doctor:false,
      patient:false
    }
  },
  methods:{
    getUser(){
      this.user= Cookies.get('userLogged');
      if (this.user==null){
        this.userLogged=false
      }else{
        this.userLogged=true;
        let aux=JSON.parse(this.user)
        this.userLogged=true
        this.role=aux['role'];
        if(this.role=='1'){
          this.doctor=true
        }
        else{
          this.patient=true
        }
      }


    },
    logout(){
      Cookies.remove('userLogged')
      location.href ="/login"
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>

<style>
#btnLogut:hover{
  color: aliceblue;
}
#btnLogut{
  background: none;
  border: none;
  color: grey;
}
</style>
