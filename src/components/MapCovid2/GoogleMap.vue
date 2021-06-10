<template>
  <gmap-map
      :center="center"
      :zoom="4"
      style="width: 100%; height: 500px"
  >
    <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        @click="center=m.position"
        :icon="pointMarker"
    ></gmap-marker>
  </gmap-map>
</template>
<script>
import axios from "axios";

export default {
  props: {
    latitude: Number,
    longitude: Number,
    title: String
  },
  data () {
    return {
      center: {lat: this.latitude, lng: this.longitude},
      markers: [],
      pointMarker:{
        path:
            "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12Z",
        fillColor: "red",
        fillOpacity: 0.8,
        scale: 0.5,
        strokeColor: "red",
        strokeWeight: 1,
      }
    }
  },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {
      axios
          .get("http://127.0.0.1:8000/covid/world")
          .then((response) => {
            console.log(response.data);
            this.markers = response.data;

          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log(error.message);
            }
            console.log(error.config);
          });
    },
  }
}
</script>