<!--
 * @Author: 汪锦
 * @Date: 2020-07-29 09:38:18
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-07-29 17:40:10
 * @Description: 综合治理 - 多选列表 - 组件递归
-->

<template>
  <div class="many-select">
    <div class="default-text" v-if="!isChild" @click="toggleHandler">
      <div class="dt-val text-overflow">{{ selectTextList || placeholder }}</div>
      <i class="el-icon-arrow-down" :class="{ active: openSelect }"></i>
    </div>
    <transition name="scaleY">
      <div class="ms-list" v-if="isChild || openSelect">
        <div
          class="ms-item"
          v-for="(item, index) in data"
          :key="index"
          @click.stop="clickHandler(item)"
          :class="{ active: item.active, showChild: item.showChild }"
        >
          <div class="sm-square" @click.stop="iconHandler(item)"></div>
          <i class="el-icon-check" @click.stop="iconHandler(item)"></i>
          <div>{{ item.name }}</div>
          <i class="el-icon-arrow-right" v-if="item.childList && item.childList.length"></i>
          <!-- 递归自身 -->
          <transition name="scaleX">
            <many-select
              class="ms-list-child"
              v-if="item.childList && item.childList.length && item.showChild"
              :data="item.childList"
              :isChild="true"
              :dataIndex="index"
              @child-slect-all="childSlectall"
              @child-slect-all-not="childSlectallNot"
            ></many-select>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// @selectItem: 增加
// @reduceItem: 减少
export default {
  name: "manySelect",
  props: {
    data: {
      type: Array,
      default: () => [
        {
          name: "重点人",
          value: "重点人",
        },
        {
          name: "一级对象",
          value: "一级对象",
        },
        {
          name: "预警人",
          value: "预警人",
          childList: [
            {
              name: "一号",
              value: "一号",
              childList: [
                {
                  name: "一号",
                  value: "一号",
                },
                {
                  name: "二号",
                  value: "二号",
                },
              ],
            },
            {
              name: "二号",
              value: "二号",
            },
          ],
        },
        {
          name: "一般",
          value: "一般",
        },
        {
          name: "普通",
          value: "普通",
        },
      ],
    },
    isChild: Boolean,
    dataIndex: Number,
    placeholder: {
      type: String,
      default: "请选择",
    },
  },
  data() {
    return {
      openSelect: false,
    };
  },
  methods: {
    // 框点击事件
    iconHandler(item) {
      if (item.childList && item.childList) {
        this.$set(item, "showChild", true);
        if (!item.active) {
          this.$set(item, "active", true);
          this.selectAll(item);
        } else {
          this.$set(item, "active", false);
          this.reduceAll(item);
          this.$emit("reduceItem", item); // 向父元素触发选中和取消
        }
      } else {
        this.clickHandler(item);
      }
    },
    // 递归选中所有子项目
    selectAll(item) {
      if (item.childList && item.childList) {
        item.childList.forEach((item) => {
          this.selectAll(item);
        });
      }
      this.$set(item, "active", true);
    },
    // 递归减少所有子项目
    reduceAll(item) {
      if (item.childList && item.childList) {
        item.childList.forEach((item) => {
          this.reduceAll(item);
        });
      }
      this.$set(item, "active", false);
    },
    // 切换选择列表
    toggleHandler() {
      this.data.forEach((__item) => {
        this.$set(__item, "showChild", false);
      });
      this.openSelect = !this.openSelect;
    },
    // 点击item
    clickHandler(item) {
      this.data.forEach((__item) => {
        // 关闭其他打开的child
        __item != item && this.$set(__item, "showChild", false);
      });
      if (item.childList && item.childList.length) {
        // 切换child
        this.$set(item, "showChild", !item.showChild);
      } else {
        this.$set(item, "active", !item.active); // 切换选中
        this.$emit(item.active ? "selectItem" : "reduceItem", item); // 向父元素触发选中和取消
      }
      console.dirxml(this.data);
      if (this.data.every((item) => item.active)) {
        // chidl所有都选中的状态下后触发
        this.$emit("child-slect-all", this.dataIndex);
      } else {
        this.$emit("child-slect-all-not", this.dataIndex);
      }
    },
    // chidl所有都选中的状态下后选中自身
    childSlectall(index) {
      this.data[index].active = true;
      this.$set(this.data[index], "active", true);
    },
    childSlectallNot(index) {
      this.$set(this.data[index], "active", false);
    },
    // 递归获取已选中的item
    getActiveList(data = this.data) {
      let arr = [];
      data.forEach((item) => {
        if (item.childList && item.childList) {
          arr.push(...this.getActiveList(item.childList));
        } else {
          item.active && arr.push(item);
        }
      });
      return arr;
    },
  },
  computed: {
    listHeight() {
      return this.data.length * 0.48;
    },
    selectTextList() {
      return this.getActiveList()
        .map((item) => item.name)
        .join(",");
    },
  },
};
</script>

<style lang="less" scoped>
@width: 1.7rem;
.ms-list {
  background: linear-gradient(0deg, rgba(0, 115, 128, 0.6) 0%, rgba(1, 69, 128, 0.6) 100%);
  cursor: pointer;
  transform-origin: center top;
  .ms-item {
    width: @width;
    height: 0.48rem;
    display: flex;
    align-items: center;
    color: #fff;
    padding-left: 0.1rem;
    padding-right: 0.2rem;
    font-size: 0.2rem;
    position: relative;
    .ms-list-child {
      transform-origin: left;
      position: absolute;
      left: @width;
      top: 0;
    }
    .sm-square {
      width: 0.15rem;
      height: 0.15rem;
      border-radius: 0.03rem;
      border: 0.01rem solid rgba(255, 255, 255, 0.6);
      margin-right: 0.14rem;
    }
    i.el-icon-arrow-right {
      margin-left: auto;
      font-size: 0.15rem;
    }
    i.el-icon-check {
      margin-right: 0.14rem;
      display: none;
      font-size: 0.2rem;
    }
    &.active,
    &:hover {
      background-color: rgba(0, 158, 226, 0.4);
    }
    &.showChild {
      background-color: rgba(0, 158, 226, 0.7);
    }
    &.active {
      color: #ffef34;
      > .sm-square {
        display: none;
      }
      > i.el-icon-check {
        display: block;
      }
    }
  }
}
.default-text {
  width: @width;
  height: 0.52rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 0.2rem;
  font-size: 0.22rem;
  color: #fff;
  position: relative;
  cursor: pointer;
  background-image: url("~@/assets/v2Image/main/many-select.png");
  background-size: 100% 100%;
  margin-bottom: 0.001rem;
  i {
    font-size: 0.2rem;
    transition: 0.3s;
    transform: rotate(0deg);
    &.active {
      transform: rotate(-180deg);
    }
  }
}
</style>
