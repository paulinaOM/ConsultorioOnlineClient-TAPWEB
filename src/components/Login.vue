<template>


  <div class="login" id="body">


    <form action class="form" @submit.prevent="login">
      <h3 class="title">Consultorio Online</h3>
      <label class="form-label" for="username">Username</label>
      <input class="form-input" v-model="username" type="username" id="username" required placeholder="Username">
      <label class="form-label" for="password">Password</label>
      <input class="form-input" type="password" v-model="pwd" id="password" placeholder="Password" required>
      <p v-if="error" class="error" style="color: azure; font-weight: bold; text-align: center">Has introducido mal el usuario o la contraseña.</p>
      <input class="form-submit" type="submit" value="Login">
    </form>
    <p class="msg">¿No tienes cuenta?
      <router-link to="/register">Regístrate</router-link>
    </p>

  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data: () => ({
    username: "",
    pwd: "",
    error: false,
    aux:""
  }),
  methods: {
    setUserLogged(userLogged) {
      Cookies.set('userLogged', userLogged);

    },
    login() {
      if (this.username==""||this.pwd=="") {
        alert("Completa todos los campos")
      }
      else {

        const formData = new FormData()
        formData.append('username', this.username)
        formData.append('pwd', this.pwd)

        var object = {};
        formData.forEach(function(value, key){
          object[key] = value;
        });
        var json = JSON.stringify(object);

        axios.post("http://127.0.0.1:8000/login",json
      ).then(response => {
        this.aux=response.data;
        if(Object.keys(this.aux).length === 0){
          this.error=true
        }else{

          this.setUserLogged(this.aux)
          location.href ="/home"
          this.isLoading = false
        }

      })
          .catch(error => {
            alert(error)
            console.log(json)
            this.isLoading = false

          })
    }

    }
  }
};
</script>

<style>
#body{
  background-color: #c2fce8;
}
.login {
  padding-top: 1rem;
  padding-bottom: 7.5rem;

}
.title {
  text-align: center;
  color: aliceblue;
}
.form {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 35px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.form-label {
  margin-top: 8px;
  color: white;
  margin-bottom: 0.5rem;

}
.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;

}
.form-submit:hover{
  color: #9ae0c0;
}
.form-submit {
  background: #1ab188;
  border: none;
  color: white;
  margin-top: 1.5rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 10px;

}
.msg {
  text-align: center;
}
</style>