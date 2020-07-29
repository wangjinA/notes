<!--
 * @Author: 汪锦
 * @Date: 2020-07-28 10:24:41
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-07-28 20:03:26
 * @Description: 综合治理- echarts地图
-->
<template>
  <div class="echartMap-container">
    <div class="echartMap" ref="echartMap"></div>
    <inflow-quantity
      class="inflowQuantity"
      :data="quantity"
      :baseColors="baseColors"
      :duration="5500"
    />
  </div>
</template>

<script>
import inflowQuantity from "./inflow-quantity";
import provinceCenter from "@/config/province-center";
export default {
  name: "echartMap",
  components: {
    inflowQuantity,
  },
  data() {
    return {
      baseColors: ["rgba(75,255,192,0.2)", "rgba(75,255,192,1)"], // 基本颜色
      quantity: [
        {
          name: "四川",
          value: 1000,
          colors: ["rgba(234,78,70,0.2)", "rgba(234,78,70,1)"],
        },
        {
          name: "湖南",
          value: 900,
          colors: ["rgba(245,203,89,0.2)", "rgba(245,203,89,1)"],
        },
        {
          name: "湖北",
          value: 800,
          colors: ["rgba(95,182,91,0.2)", "rgba(95,182,91,1)"],
        },
        {
          name: "上海",
          value: 700,
        },
        {
          name: "江西",
          value: 600,
        },
        {
          name: "安徽",
          value: 500,
        },
        {
          name: "河北",
          value: 400,
        },
        {
          name: "河南",
          value: 300,
        },
        {
          name: "广西",
          value: 200,
        },
        {
          name: "江苏",
          value: 100,
        },
      ].reverse(),
    };
  },
  mounted() {
    const geoJson = require("@/assets/geo/quanguo.json");
    this.$echarts.registerMap("quanguo", geoJson);
    let targetProvince = provinceCenter.filter((item) => item.name === "北京")[0]; // 飞往北京
    let points = this.quantity.map((item) => {
      let provinceItem = provinceCenter.filter((p) => p.name === item.name)[0];
      let colors = item.colors ? item.colors : this.baseColors;
      return {
        name: item.name,
        value: provinceItem.value,
        itemStyle: {
          color: colors[1],
        },
      };
    });
    console.dirxml(points);
    let index = -1;
    let option = {
      backgroundColor: "transparent",
      geo: {
        map: "quanguo",
        zoom: 1.2,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: "#30aacd",
            },
          },
          emphasis: {
            textStyle: {
              color: "#fff",
            },
          },
        },
        itemStyle: {
          normal: {
            borderColor: "#4dcfff", // 边框
            borderWidth: 1,
            color: "transparent",
            areaColor: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(23, 118, 178, 0.15)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(124, 238, 255, 0.5)", // 100% 处的颜色
                },
              ],
              globalCoord: true, // 缺省为 false
            },
          },
          emphasis: {
            areaColor: "#30aacd",
            borderWidth: 0.1,
          },
        },
      },
      series: [
        {
          type: "effectScatter", // 点
          coordinateSystem: "geo",
          showEffectOn: "render",
          zlevel: 1,
          rippleEffect: {
            period: 5,
            scale: 3,
            brushType: "stroke",
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: "{b}",
              position: "right",
              offset: [15, 0],
              color: "#1DE9B6",
              show: false,
            },
          },
          itemStyle: {
            normal: {
              color: "#1DE9B6",
              shadowBlur: 5,
              shadowColor: "#333",
            },
          },
          symbolSize: this.fontSize(0.14),
          data: points,
        },
        {
          type: "lines", //地图线的动画效果
          zlevel: 7,
          effect: {
            show: true,
            period: 4, //箭头指向速度，值越小速度越快
            trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: "pin", //箭头图标
            symbolSize: 7, //图标大小
          },
          lineStyle: {
            type: "dotted",
            color: "#1DE9B6",
            width: 1, //线条宽度
            opacity: 0.2, //尾迹线条透明度
            curveness: 0.3, //尾迹线条曲直度
          },
          data: points.map((item) => {
            return {
              coords: [item.value, targetProvince.value],
              lineStyle: {
                color: item.itemStyle.color,
              },
            };
          }),
        },
      ],
    };
    this.myChart = this.$echarts.init(this.$refs.echartMap);
    window.$echarts = this.$echarts;
    window.myChart = this.myChart;
    this.myChart.setOption(option);
    this.myChart.on("click", (e) => {
      console.dirxml(e);
    });
  },
};
</script>

<style lang="less" scoped>
.echartMap-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .echartMap {
    width: 13rem;
    height: 90%;
    margin-bottom: auto;
  }
  .inflowQuantity {
    width: 2rem;
    // height: 100%;
  }
}
</style>
