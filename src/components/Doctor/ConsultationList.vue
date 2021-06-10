<template>
  <div class="container">
    <h4>Consultas pendientes</h4>
    <div v-if="doctor" class="row" style="margin-top: 1rem ">
      <div v-for="consultation in consultations"  :key="consultation.id" class="card text-white bg-info mb-3" style="max-width: 20rem; margin-left: 2rem">
        <div class="card-header" style="display: inline-flex"><b>Paciente:<b style="visibility: hidden">a</b> </b> {{consultation.patient_name }}
        <button v-on:click="getConsultation(consultation.id)"><img style="width: 35px; margin-left: 10px" src="data:image/svg+xml;base64,PHN2ZyBpZD0iZmlsbGVkX291dGxpbmUiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkYXRhLW5hbWU9ImZpbGxlZCBvdXRsaW5lIj48cGF0aCBkPSJtMzkyIDE4NHYyODBhMTYgMTYgMCAwIDEgLTE2IDE2aC0zMzZhMTYgMTYgMCAwIDEgLTE2LTE2di0yODB6IiBmaWxsPSIjNTQ4YWZmIi8+PHBhdGggZD0ibTM5MiAxODRoLTM2OHYtMzJhMTYgMTYgMCAwIDEgMTYtMTZoMzM2YTE2IDE2IDAgMCAxIDE2IDE2eiIgZmlsbD0iIzdkYWZmZiIvPjxwYXRoIGQ9Im0xNTIgMjY0YTQ4IDQ4IDAgMSAxIC00OC00OCA0Ny44NDI0OSA0Ny44NDI0OSAwIDAgMSA0OCA0OHoiIGZpbGw9IiM5MWMwZmYiLz48cGF0aCBkPSJtMTM2IDI4OHYxMS43N2E0Ny45NzkzMyA0Ny45NzkzMyAwIDAgMSAtNjQgMHYtMTEuNzdhMTUuOTk1NTIgMTUuOTk1NTIgMCAwIDEgMTYtMTZoMzJhMTUuOTk1NTIgMTUuOTk1NTIgMCAwIDEgMTYgMTZ6IiBmaWxsPSIjZWY1ZTNiIi8+PHJlY3QgZmlsbD0iI2ZmY2ViNiIgaGVpZ2h0PSI0MCIgcng9IjE2IiB3aWR0aD0iMzIiIHg9Ijg4IiB5PSIyNDAiLz48cGF0aCBkPSJtNDkwLjY2NjY1IDEyOC00MC41MzMzOCAzMC40YTE2Ny45OTk4NiAxNjcuOTk5ODYgMCAwIDEgLTEwMC43OTk4OSAzMy42aC0uMDAwMTJhMTY3Ljk5OTgxIDE2Ny45OTk4MSAwIDAgMSAtMTAwLjc5OTktMzMuNmwtNDAuNTMzMzYtMzAuNCA0MC41MzMzNi0zMC40YTE2Ny45OTk4MSAxNjcuOTk5ODEgMCAwIDEgMTAwLjc5OTktMzMuNmguMDAwMTJhMTY3Ljk5OTg2IDE2Ny45OTk4NiAwIDAgMSAxMDAuNzk5ODkgMzMuNnoiIGZpbGw9IiNlMGVkZmYiLz48cGF0aCBkPSJtNDEzLjMzMzMxIDEyOGE2NCA2NCAwIDAgMSAtMTI4IDBjMC0uNzcuMDA5NzctMS41NS4wNC0yLjMxMDA2YTY0LjAwMDg1IDY0LjAwMDg1IDAgMCAxIDEyNy45NiAyLjMxMDA2eiIgZmlsbD0iI2ZmYzQzMSIvPjxwYXRoIGQ9Im0zNTcuMzMzMzEgNzJhNTYuMDM2NDEgNTYuMDM2NDEgMCAwIDEgLTcxLjk2IDUzLjY4OTk0IDY0LjAwMDY0IDY0LjAwMDY0IDAgMCAxIDcxLjQ1MDItNjEuMjUgNTUuNTE0MDUgNTUuNTE0MDUgMCAwIDEgLjUwOTggNy41NjAwNnoiIGZpbGw9IiNmZmUyOGYiLz48cGF0aCBkPSJtMzczLjMzMzMxIDEyOGEyNCAyNCAwIDAgMSAtNDggMCAyMy40ODI2NSAyMy40ODI2NSAwIDAgMSAuNzAwMi01LjczIDU2LjIzNSA1Ni4yMzUgMCAwIDAgMjEuMTk5NzEtMTguMTgwMThxMS4wMzQ5MS0uMDg5NzEgMi4xMDAwOS0uMDg5ODRhMjQuMDA2MTkgMjQuMDA2MTkgMCAwIDEgMjQgMjQuMDAwMDJ6IiBmaWxsPSIjZmZhMTAwIi8+PHBhdGggZD0ibTMwNi42NjcgMjRoMjR2MTZoLTI0eiIvPjxwYXRoIGQ9Im0zODQgNDY0YTguMDA5MTcgOC4wMDkxNyAwIDAgMSAtOCA4aC0zMzZhOC4wMDkxNyA4LjAwOTE3IDAgMCAxIC04LTh2LTI3MmgyMDIuNjY3di0xNmgtMjAyLjY2N3YtMjRhOC4wMDkxNyA4LjAwOTE3IDAgMCAxIDgtOGgxNDYuNjY3di0xNmgtMTQ2LjY2N2EyNC4wMjc1IDI0LjAyNzUgMCAwIDAgLTI0IDI0djMxMmEyNC4wMjc1IDI0LjAyNzUgMCAwIDAgMjQgMjRoMzM2YTI0LjAyNzUgMjQuMDI3NSAwIDAgMCAyNC0yNHYtMjU2aC0xNnoiLz48Y2lyY2xlIGN4PSI0OCIgY3k9IjE2MCIgcj0iOCIvPjxjaXJjbGUgY3g9IjcyIiBjeT0iMTYwIiByPSI4Ii8+PGNpcmNsZSBjeD0iOTYiIGN5PSIxNjAiIHI9IjgiLz48cGF0aCBkPSJtMTYwIDI2NGE1NiA1NiAwIDEgMCAtNTYgNTYgNTYuMDYyOSA1Ni4wNjI5IDAgMCAwIDU2LTU2em0tNTYtNDBhMzkuOTk2OTEgMzkuOTk2OTEgMCAwIDEgMzcuNjIwNjEgNTMuNTg2NDMgMjQuMTI5MjYgMjQuMTI5MjYgMCAwIDAgLTEzLjY2MTYxLTEyLjIyNDEzYy4wMjU0LS40NTExNy4wNDEtLjkwNDc4LjA0MS0xLjM2MjN2LThhMjQgMjQgMCAwIDAgLTQ4IDB2OGMwIC40NTc1Mi4wMTU2Mi45MTExMy4wNDEgMS4zNjIzYTI0LjEyOTI2IDI0LjEyOTI2IDAgMCAwIC0xMy42NjE2MyAxMi4yMjQxMyAzOS45OTY5MSAzOS45OTY5MSAwIDAgMSAzNy42MjA2My01My41ODY0M3ptOCA0MGE4IDggMCAwIDEgLTE2IDB2LThhOCA4IDAgMCAxIDE2IDB6bS0zMiAzMS45Nzh2LTcuOTc4YTguMDEwOTIgOC4wMTA5MiAwIDAgMSA2LjI5NzYxLTcuODEzNDggMjMuOTYwMiAyMy45NjAyIDAgMCAwIDM1LjQwNDc4IDAgOC4wMTA5MiA4LjAxMDkyIDAgMCAxIDYuMjk3NjEgNy44MTM0OHY3Ljk3OGEzOS45MTIzOSAzOS45MTIzOSAwIDAgMSAtNDggMHoiLz48cGF0aCBkPSJtMTIwIDM1NS4zMTQ0NSA5LjY1NzIzLTkuNjU3MjItMTEuMzE0NDYtMTEuMzE0NDYtMzYgMzYgMTEuMzE0NDYgMTEuMzE0NDYgMTAuMzQyNzctMTAuMzQyNzh2MjAuNjg1NTVoLTMydi0zMmgxNnYtMTZoLTI0YTguMDAwMzkgOC4wMDAzOSAwIDAgMCAtOCA4djQ4YTguMDAwMzkgOC4wMDAzOSAwIDAgMCA4IDhoNDhhOC4wMDAzOSA4LjAwMDM5IDAgMCAwIDgtOHoiLz48cGF0aCBkPSJtMTQ0IDM1MmgyNHYxNmgtMjR6Ii8+PHBhdGggZD0ibTE4NCAzNTJoMTUydjE2aC0xNTJ6Ii8+PHBhdGggZD0ibTE0NCAzODRoNjR2MTZoLTY0eiIvPjxwYXRoIGQ9Im0yMjQgMzg0aDQ4djE2aC00OHoiLz48cGF0aCBkPSJtMTA0IDQzMmgxNnYxNmgtMTZ6Ii8+PHBhdGggZD0ibTE1MiA0MzJoMTZ2MTZoLTE2eiIvPjxwYXRoIGQ9Im0yMDAgNDMyaDE2djE2aC0xNnoiLz48cGF0aCBkPSJtMjQ4IDQzMmgxNnYxNmgtMTZ6Ii8+PHBhdGggZD0ibTI5NiA0MzJoMTZ2MTZoLTE2eiIvPjxwYXRoIGQ9Im0xODQgMjMyaDI0djE2aC0yNHoiLz48cGF0aCBkPSJtMjI0IDIzMmg3MnYxNmgtNzJ6Ii8+PHBhdGggZD0ibTE4NCAyNjRoODB2MTZoLTgweiIvPjxwYXRoIGQ9Im0yODAgMjY0aDU2djE2aC01NnoiLz48cGF0aCBkPSJtNDkyLjc5OTggMTIxLjU5OTYxLTE5LjYwNDQ5LTE0LjcwMzYxYTEzNS4xOTYgMTM1LjE5NiAwIDAgMCAtMTI0LjY5MTQtODIuODk2aC0xLjgzNjkxdjE2aDEuODM2OTJhMTE5LjI3MDU4IDExOS4yNzA1OCAwIDAgMSA5MS41NzEyOCA0Mi44NTIyOSAxNzUuOTUwNDYgMTc1Ljk1MDQ2IDAgMCAwIC0xOTkuMDA3ODIgOC4zNDY5M2wtNDAuNTM0MTggMzAuNDAwMzlhOC4wMDA1IDguMDAwNSAwIDAgMCAwIDEyLjgwMDc4bDQwLjUzNDE4IDMwLjQwMDM5YTE3Ni4wMDIgMTc2LjAwMiAwIDAgMCAyMTEuMTk5MjIgMGw0MC41MzMyLTMwLjQwMDM5YTguMDAwNDggOC4wMDA0OCAwIDAgMCAwLTEyLjgwMDc4em0tMTQ2LjEzMjggNjIuNDAwMzlhNTYuMDczMDggNTYuMDczMDggMCAwIDEgLTU1LjQ3NTU4LTQ4LjQ0MjM4IDYzLjc2Njc0IDYzLjc2Njc0IDAgMCAwIDI0LjAxNjExLTEuNzM0MTMgMzEuOTk2NjIgMzEuOTk2NjIgMCAxIDAgNDIuMDQtMzYuMDE3ODMgNjMuNjI3IDYzLjYyNyAwIDAgMCA1LjM3NTQ5LTIzLjQ5MTcgNTYuMDA0MiA1Ni4wMDQyIDAgMCAxIC0xNS45NTYwMiAxMDkuNjg2MDR6bTAtMTEyYTQ3LjczNyA0Ny43MzcgMCAwIDEgLTguNjUzMzIgMjcuNTAxIDQ4LjMwNjIgNDguMzA2MiAwIDAgMSAtMTguMTgxNjggMTUuNTkxNzcgNDcuNDg4MTggNDcuNDg4MTggMCAwIDEgLTIxLjE2NSA0LjkwNzIzIDQ4LjMxOTA4IDQ4LjMxOTA4IDAgMCAxIC03LjM0MTMxLS41NjU0MyA1NS43NTMxMSA1NS43NTMxMSAwIDAgMSA1NS4zNDEzMS00Ny40MzQ1N3ptLTE1Ljk4MjQyIDU1LjQxODdhNjQuNDQ1NjggNjQuNDQ1NjggMCAwIDAgMTcuODQ0NzMtMTUuMzAxIDE1Ljk5NTggMTUuOTk1OCAwIDEgMSAtMTcuODYyMzEgMTUuODgyM2MwLS4xOTQ4Mi4wMTAyNS0uMzg3Ny4wMTc1Ny0uNTgxM3ptLTExMi4wMTg1OC41ODEzIDMyLjAwMS0yNGExNTkuOTI2NDQgMTU5LjkyNjQ0IDAgMCAxIDQwLjY3MjM3LTIyLjA2NDk0IDcxLjUxMjA3IDcxLjUxMjA3IDAgMCAwIC0xNi42MjY0NyA0My40MzZjLS4wMzQxOC44NjYyMS0uMDQ1OSAxLjc1MzkxLS4wNDU5IDIuNjI4OTFhNzEuNjY1NzggNzEuNjY1NzggMCAwIDAgMTYuNzM1MzUgNDYuMDg3ODkgMTU5LjkyMTU0IDE1OS45MjE1NCAwIDAgMSAtNDAuNzM1MzUtMjIuMDg3ODZ6bTIyNC4wMDEgMjRhMTU5LjkyMTU0IDE1OS45MjE1NCAwIDAgMSAtNDAuNzM1MzUgMjIuMDg3ODkgNzEuOTI3IDcxLjkyNyAwIDAgMCAuMDg1NDUtOTIuMTQ0NTMgMTU5LjkyNTUyIDE1OS45MjU1MiAwIDAgMSA0MC42NDk5IDIyLjA1NjY0bDMyIDI0eiIvPjwvc3ZnPg==" /></button>
        </div>
        <div class="card-body">
          <h6 style="text-align: right"><small>{{consultation.consultation_date }}</small></h6>
          <h4 class="card-title">Síntomas</h4>
         <p class="card-text" style="white-space: nowrap; overflow:hidden;text-overflow: ellipsis; ">{{ consultation.symptom }}</p>
        </div>
      </div>
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
      doctor:false,
      userLogged:false,
      id_doctor:'',
      id_speciality:'',
      consultations:[]
    }
  },
  methods:{
    getConsultation(id){
      this.$router.push({
        name: "consultationDetails",
        params:{
          id: id,
        }
      });
    },
    initialize() {
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
                this.id_speciality=response.data.id_speciality
                axios.get("http://127.0.0.1:8000/consultation/speciality/"+this.id_speciality)
                    .then((response)=>{
                      this.consultations=response.data;
                      console.log(this.consultations)
                    });
              });
        }
      }
    },
  },
  mounted() {
    this.initialize()
  }

}

</script>
<style>


</style>