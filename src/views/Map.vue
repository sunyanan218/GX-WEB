<template>
  <div class="map">
    <div
      class="header"
      style="
        position: relative;
        height: 96px;
        background-color: #eeeeee;
        padding-right: 24px;
        margin-top: 8px;
      "
    >
      <span style="display: flex"
        ><div class="tab" style="background-color: brown"></div>
        机器人急停次数：{{ scramRecords.length }}
      </span>
      <span style="display: flex">
        <div class="tab" style="background-color: yellow"></div>
        机器人定位跳动次数：{{ jumpRecords.length }}
      </span>
      <span style="display: flex"
        ><div class="tab" style="background-color: blue"></div>
        机器人定位丢失次数：{{ loseRecords.length }}
      </span>
    </div>
    <div
      class="map"
      :style="{
        backgroundImage: `url('http://localhost:5000${map.mapadress}')`,
      }"
    >
      <div
        class="point"
        v-for="record in scramRecords"
        :key="record.id"
        :style="getPointStyle(record)"
        style="background-color: brown"
      ></div>
      <div
        class="point"
        v-for="record in jumpRecords"
        :key="record.id"
        :style="getPointStyle(record)"
        style="background-color: yellow"
      ></div>
      <div
        class="point"
        v-for="record in loseRecords"
        :key="record.id"
        :style="getPointStyle(record)"
        style="background-color: blue"
      ></div>
      <div
        class="point"
        v-for="record in data"
        :key="record.id"
        :style="getPointStyle(record)"
        style="background-color: cyan; width: 5px; height: 5px"
      ></div>
    </div>
  </div>
</template>

<script>
// 3. 根据页面设计和数据，画页面。
// 4. 画页面的过程中，会遇到原始数据无法直接使用的情况，这个时候就需要考虑编写数据转换的函数，把原始数据处理成页面需要的数据。
// 5. 当原始数据转成页面需要的数据过于消耗性能时，考虑增加数据转换的缓存。（空间换时间）- 如果是 VUE 环境，在第 4 步直接使用计算属性。

// 前端开发流程，常见误区：1. 上来就直接画页面；2. data 里面保存中间态数据，或者缓存数据。不要一开始就考虑加缓存。
// 加缓存意味着什么？意味着你的变量多了一个，你维护的数据就多了。项目复杂度就上升了。

import { fetchSlam, fetchMap } from "@/services/api";
export default {
  name: "Map",
  data() {
    return {
      // 1. 根据页面功能，想清楚需要哪些数据。数据最好是原始的，基础的，唯一的，不要存中间态的数据。
      scramRecords: [], // 急停的记录
      jumpRecords: [],
      loseRecords: [],
      data: [],
      mapname: "",
      map: {},
    };
  },
  mounted() {
    this.getScramData();
    this.getJumpData();
    this.getLoseData();
    this.getData();
    this.getmap();
    window.setInterval(() => {
      setTimeout(this.getData(), 0);
    }, 1000);
    window.setInterval(() => {
      setTimeout(this.getScramData(), 0);
      setTimeout(this.getJumpData(), 0);
      setTimeout(this.getLoseData(), 0);
      setTimeout(this.getmap(), 0);
    }, 10000);
  },
  // computed: {
  //   // 計算屬性的應用場景：原始数据无法满足页面渲染的需求时，需要经过一定的计算得到页面需要的数据。 计算属性有缓存（优点）。
  //   currentMap() {
  //     return this.maps.find((map) => map.id === this.currentMapID);
  //   },
  // },
  methods: {
    // 2. 操作数据的方法：获取初始数据的方法；页面交互导致数据变更（点击事件）
    // getMapByID() {
    //   return this.maps.find((map) => map.id === this.currentMapID);
    //   // for (let i = 0; i < this.maps.length; i++) {
    //   //   const map = this.maps[i];
    //   //   if (map.id === this.currentMapID) return map;
    //   // }
    // },
    async getScramData() {
      const p = this.$route.query;
      const json = await fetchSlam("急停", p.taskId);
      this.scramRecords = json.result;
      return json.result[2].mapname; //应该获取data里面的地图，需要修改
    },

    async getJumpData() {
      const p = this.$route.query;
      const json = await fetchSlam("定位跳动", p.taskId);
      this.jumpRecords = json.result;
    },
    async getLoseData() {
      const p = this.$route.query;
      const json = await fetchSlam("定位丢失", p.taskId);
      this.loseRecords = json.result;
    },
    async getData() {
      const p = this.$route.query;
      const json = await fetchSlam(1, p.taskId);
      this.data = json.result;
    },
    async getmap() {
      const p = this.$route.query;
      const floor = await this.getScramData();
      const json = await fetchMap(floor + "楼", p.robotid);
      // this.map = result.data[0];
      this.map = json.result;
      // const url = "~/projects/gxtest" + this.map.mapadress + "";
      // document.getElementById("pic").src = url;
      // console.log(url);
    },
    getPointStyle(record) {
      const coordinate = record.coordinate;
      const [x, y] = coordinate.split(",");
      return {
        left: x + "px",
        top: y + "px",
      };
    },
  },
};
</script>

<style>
.tab {
  height: 10px;
  width: 10px;
  margin-top: 8px;
  border-radius: 50px;
  margin-left: 16px;
}

.map {
  position: relative;
  height: 500px;
}

.point {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: cyan;
  transform: translate(-50%, -50%);
}
</style>
