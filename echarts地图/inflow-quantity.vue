<!--
 * @Author: 汪锦
 * @Date: 2020-07-28 15:22:38
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-07-28 20:01:06
 * @Description: 综合治理 - 各省流入数量 - 需要注意的是此组件高度是通过计算来的
-->
<template>
  <div class="inflowQuantity" ref="inflowQuantity"></div>
</template>

<script>
export default {
  mixins: [echartMixin],
  name: "inflowQuantity",
  props: {
    data: Array,
    baseColors: Array,
  },
  methods: {
    getChartOption() {
      let vm = this;
      let series = [];
      let data = this.data;
      let dom = this.$refs.inflowQuantity;
      data.length * 0.4 + 0.4;
      dom.style.height = data.length * 0.3 + 0.4 + "rem";
      series = [
        {
          data: data.map((item) => item.value),
          legendHoverLink: false,
          type: "bar",
          barGap: 10,
          barWidth: this.fontSize(0.08),
          itemStyle: {
            normal: {
              color(item) {
                let colors = data[item.dataIndex].colors || vm.baseColors;
                return new vm.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  1,
                  // 柱体颜色渐变
                  colors.map((color, i) => ({
                    offset: i,
                    color,
                  })),
                  false
                );
              },
              barBorderRadius: [0, 10, 10, 0],
            },
            emphasis: {
              show: false,
            },
          },
        },
      ];
      return {
        title: {
          text: "各省流入数量",
          left: 0,
          textStyle: {
            color: "#fff",
            fontSize: this.fontSize(0.2),
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function(params) {
            return "流入数量<br>" + params[0].name + ": " + params[0].value;
          },
        },
        animationDuration: 1500,
        emphasis: {
          show: false,
        },
        label: {
          //柱顶提示数字
          show: false,
        },
        grid: {
          left: "10%",
          top: this.fontSize(0.36),
          right: "0%",
          bottom: "0",
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: [
          {
            // type: 'value', //---轴类型，默认'category'
            // nameGap: 15,
            offset: 10,
            data: data.map((item) => item.name),
            axisLabel: {
              fontSize: this.fontSize(0.16),
              color: "rgba(255,255,255,1)",
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series,
      };
    },
    creatCharts() {
      let chartOption = this.getChartOption();
      if (!this.myChart) {
        this.myChart = this.$echarts.init(this.$refs.inflowQuantity);
      }
      // // 绘制图表
      this.myChart.setOption(chartOption);
    },
  },
  mounted() {
    this.creatCharts();
  },
};
</script>
