<template>
  <div :id="id" class="svg-container"></div>
</template>

<script>
import provinces from "./mexico-provinces.json";
import svg from "svg.js/dist/svg";

export default {
  name: "MexicoProvincesMap",
  props: {
    id: {
      type: String,
      default: "mexico-map"
    }
  },
  data() {
    return {
      mapAttr: {
        viewBoxWidth: 1000,
        viewBoxHeight: 891
      }
    };
  },
  mounted() {
    this.generateMap();
  },
  methods: {
    generateMap() {
      const svgContainer = svg(this.id)
        .size("100%", "100%")
        .viewbox(0, 0, this.mapAttr.viewBoxWidth, this.mapAttr.viewBoxHeight);
      provinces.forEach(pathObj => {
        this.generatePath(svgContainer, pathObj);
      });
    },
    generatePath(svgCont, pathObj) {
      const attrs = {
        fill: "transparent",
        stroke: "#d79750",
        "stroke-width": 1,
        title: pathObj["@name"],
        "map-id": pathObj["@id"]
      };

      const province = svgCont.path(pathObj["@d"]).attr(attrs);

      province.click(e => {        
        const mapId = e.target.attributes["map-id"].value;
        const title = e.target.attributes.title.value;        
        this.$emit("map-click", { mapId, title });
      });
    }
  }
};
</script>

<style lang="scss">
.svg-container {
  width: 100%;
  position: relative;
  path {
    cursor: pointer;
    fill: rgba(#b2d676, 0.5); //color relleno del mapa b2d676
    transition: all 0.2s ease-in-out;

    &:hover {
      fill: #c1f16d;  //color hover mapa a0d9f5
      stroke-width: 3;
    }
  }
}
</style>
