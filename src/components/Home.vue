
<template>

  <div>
    <div v-if="!userLogged" class="alert alert-warning" role="alert">
      ¡Bienvenido! <a href="/login" class="alert-link">Inicia sesión</a> o <a href="/register" class="alert-link">regístrate</a>.
    </div>
    <div id="home">
    <div class="content">
      <div class="d-flex align-items-center flex-column justify-content-center">
        <h1>Bienvenido <br>Consultorio online</h1>
        <h4>En conexión con tu salud</h4><p>Los mejores doctores a un mensaje de distancia.
        La tecnología y la salud son el corazón de nuestro trabajo, nuestro es compromiso brindarte una atención médica accesible y de calidad</p>
      </div>
    </div>
    <div id="slideToNext" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img width="100%" height="500px" src="https://cita.io/wp-content/uploads/2016/10/seguridad.jpg" class="d-block w-100">
        </div>
        <div class="carousel-item">
          <img width="100%" height="500px" src="https://www.trecebits.com/wp-content/uploads/2017/12/m%C3%A9dico-app-798x445.jpg" class="d-block w-100">
        </div>
        <div width="100%" height="500px" class="carousel-item">
          <img src="https://www.revistaneo.com/sites/default/files/2019-02/habilitan%20consultas%20medicas%20online%20para%20viajeros.jpg" class="d-block w-100">
        </div>
      </div>
      <a class="carousel-control-prev" href="#slideToNext" role="button" data-slide="prev">
        <i class="fas fa-chevron-left"></i>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#slideToNext" role="button" data-slide="next">
        <i class="fas fa-chevron-right"></i>
        <span class="sr-only">Next</span>
      </a>
    </div>
    </div>
    <div class="about" id="about">
      <div class="row">
        <div class="col-lg-6 col-12">
          <div class="img"><img src="https://mundodehoy.com/wp-content/uploads/2020/09/salud-digital.jpg"></div>
        </div>
        <div class="col-lg-6 col-12 text-right">
          <div class="about-child">
            <h2 class="text-uppercase">¿Quiénes somos?</h2>
            <p>Consultorio Online es una plataforma que busca ayudar a médicos y pacientes</p>
            <p>Podrás seleccionar y comunicarte de forma ágil y segura con el profesional de la salud que más se adecue a tus necesidades a través de un amplio directorio de especialidades, además serás capaz de registrar tu historia clínica, ver tu historial de citas y acceder facilmente a tus recetas y facturas.</p>
            <br><br>
            <h3>¡Descarga nuestra app móvil!</h3><p>Revisa tu historial de citas, y agenda consultas desde cualquier lugar.</p>

          </div>
        </div>
      </div>
    </div>
    <div class="services" id="service">
      <div class="container"><h2 class="text-capitalize"><span>Nuestros</span> servicios</h2></div>
      <div class="services-child">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-12">
              <div>
                <img src="https://us.123rf.com/450wm/drogatnev/drogatnev1801/drogatnev180100012/93528929-consulta-m%C3%A9dica-online-e-suporte-m%C3%A9dico-on-line-ilustra%C3%A7%C3%A3o-vetorial-em-estilo-simples.jpg?ver=6">
                <a href="#"><h4>Médicos</h4></a>
                <p style="text-align: justify">Podrás registrar tus servicios y sus costos, tendrás acceso a la historia clínica de tus pacientes y podrás generar recetas de forma digital.</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-12">
              <div>
                <img src="https://image.freepik.com/vector-gratis/tecnologia-telemedicina-medico-femenino-mujer-enferma_24877-63355.jpg">
                <a href="#"><h4>Pacientes</h4></a>
                <p style="text-align: justify">Podrás seleccionar a los especialistas que se adapten a tus necesidades, registra tus síntomas y adjunta fotos como evidencia de forma segura.</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-12">
              <div>
                <img src="https://soyweb.mx/wp-content/uploads/2019/03/tiendaenlinea.png">
                <a href="#"><h4>Tienda en línea</h4></a>
                <p style="text-align: justify">Contamos con una tienda en línea para que surtas tus medicamentos, elige los productos que se adapten mejor a tus necesidades con base en su precio y sus características.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="footer">
      Copyrights © [2021] <a href="#">CONSULTORIO ONLINE</a> Design by Paulina Otero y Naomi Ortiz
    </div>
  </div>

</template>

<script>
import Cookies from "js-cookie";
export default {
  data(){
    return{
      user:{},
      userLogged:false,
      username:''
    }
  },
  methods: {
    userLoggedF() {
      this.user= Cookies.get('userLogged');
      if (this.user==null){
        this.userLogged=false
      }
      else{
        this.userLogged=true
        let aux=JSON.parse(this.user)
        this.username=aux['username'];
      }
    }
  },
  mounted() {
    this.userLoggedF();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#home .carousel-inner, #home .carousel-item {
  height: 100%;
}

.carousel-control-prev, .carousel-control-next {
  z-index: 7
}
.carousel-control-prev, .carousel-control-next {
  position: absolute;
  right: 0;
  text-align: center;
  top: 85%;
  height: 40px;
  width: 60px;
  line-height: 40px;
  background-color: #70bbb0;
}

#home .carousel-control-next i, #home .carousel-control-prev i {
  font-size: 22px;
  color: black;
}

#home .carousel-control-next {
  background-color: #f5e7d4;
  top: 77%;
}

#home .carousel-control-prev {
  position: absolute;
  left: auto;
}
#home {
  position: relative
}

#home img {
  width: 100%;
  height: 500px;
}

#home .content {
  position: absolute;
  z-index: 5;
  height: 100%;
  width: 100%;
}

#home .carousel-inner, #home .carousel-item {
  height: 100%;
}

.carousel-control-prev, .carousel-control-next {
  z-index: 7
}

#home .content > div:first-of-type {
  height: 100%;
  width: 60%;
  margin: 0 auto;
  text-align: center;
  color: white;
}

#home .content > div:first-of-type h1 {
  margin-bottom: 20px
}

#home .content {
  background-color: rgba(0,0,0, .3);
  width: 100%;
  height: 100%;
}

#home .content a {
  width: 170px;
  border: 2px solid #ffe25b;
  margin-top: 30px;
  text-align: right;
  color: white;
}

#home .content a i {
  padding: 5px 15px;
  color: black;
  background-color: #ffe25b
}

#home .content a span {
  margin-right: 20px;
  position: relative;
  bottom: 7px;
}
.about {
  padding: 50px 0
}

.about .img {
  width: 85%;
}

.about .img img{
  width: 100%;
  height: auto;
}

.about .row > .col-lg-6:first-of-type {
  position: relative;
}

.about .about-child {
  width: 70%
}

.about .about-child > p:first-of-type {
  font-size: 20px;
  font-weight: bold;
}

.about  a {
  width: 170px;
  border: 2px solid #ffe25b;
  margin-top: 30px;
  text-align: left;
  color: black;
  float: right;
}

.about a i {
  padding: 5px 15px;
  color: black;
  background-color: #ffe25b
}

.about a span {
  margin-left: 20px;
  position: relative;
  bottom: 7px;
}
.services {
  margin-bottom: 50px
}

.services .container {
  overflow: hidden
}

.services .services-child {
  background-color: #ebebeb;
  padding: 60px 0;
}

.services img {
  width: 100%;
  height: 300px;
  margin-bottom: 20px
}

.services .col-lg-4 > div {
  width: 100%;
  height: 100%;
}

.services .link {
  border: 3px solid #ffe25b;
  width: 160px;
  float: right;
}

.services .row a {
  color: black;
}

.services .row a:hover {
  color: #ffe25b;
}

.services .container > a {
  width: 170px;
  border: 2px solid #ffe25b;
  margin-top: 30px;
  text-align: left;
  color: black;
  float: right;
}

.services .container > a i {
  padding: 5px 15px;
  color: black;
  background-color: #ffe25b
}

.services .container > a span {
  margin-left: 20px;
  position: relative;
  bottom: 7px;
}

#footer {
  background-color: #1b1b1a;
  color: white;
  padding-top: 30px;
  text-align: center;
  padding-bottom: 30px;
}

#footer .container {
  overflow: hidden;
}

</style>
