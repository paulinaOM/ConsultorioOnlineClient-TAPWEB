<template>
  <div class="register" id="body">

    <form action class="form" @submit.prevent="register">
      <h3 class="title">Sign Up</h3>
      <label class="form-label" for="username">Username</label>
      <input
          v-model="username"
          class="form-input"
          type="text"
          id="username"
          required
          placeholder="Username"
      >
      <label class="form-label" for="password">Password</label>
      <input
          v-model="pwd"
          class="form-input"
          type="password"
          id="password"
          placeholder="Password"
      >
      <label class="form-label" for="password-repeat">Confirmar password</label>
      <input
          v-model="pwdRepeat"
          class="form-input"
          type="password"
          id="password-repeat"
          placeholder="Password"
      >
      <label class="form-label">Role</label>
      <select v-model="role">
        <option value=1>Doctor</option>
        <option value=2>Paciente</option>
      </select>
      <input class="form-submit" type="submit" value="Registrarme">

    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    username: "",
    pwd: "",
    pwdRepeat: "",
    role:1,
    aux:""
  }),
  methods: {
    register() {
      if (this.username==""||this.pwd==""||this.pwdRepeat==""||this.role=="") {
        alert("Completa todos los campos")
      }
      axios.get("http://127.0.0.1:8000/username/"+this.username)
      .then((response)=>{
        console.log(response.data)
        this.aux=response.data
        if(Object.keys(this.aux).length === 0){
          if(this.pwd==this.pwdRepeat){
            const formData = new FormData()
            formData.append('username', this.username)
            formData.append('pwd', this.pwd)
            formData.append('role', this.role)

            var object = {};
            formData.forEach(function(value, key){
              object[key] = value;
            });
            var json = JSON.stringify(object);

            axios.post("http://127.0.0.1:8000/user",json
            ).then(response => {
              console.log(response.data)
              console.log("Datos almacenados correctamente")
              if(this.role=="1"){
                location.href ="/registerDoctor"
              }
              if(this.role=="2"){
                location.href ="/registerPatient"
              }

            })
                .catch(error => {
                  alert(error)
                  console.log(json)
                })
          }
          else{
            alert("Las contraseñas no coinciden")
          }


        }
        else{
          alert("Ya existe un usuario con ese username")
          this.username=""
        }
      })

    }
  }
};
</script>
<style>
select{
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;

}
select option{
  padding: 10px 15px;
  background-color:rgba(19, 35, 47, 0.9) ;
  background-image: none;
  border: 1px solid white;
  color: white;
  user-focus: all;
}
#body{
  background-color: #c2fce8;
}
.register {
  padding-top: 1rem;
  padding-bottom: 4.5rem;

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
  user-focus: all;
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
</style>