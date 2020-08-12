<!--
 * @Author: 汪锦
 * @Date: 2020-07-29 09:38:18
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-08-07 16:50:34
 * @Description: 综合治理 - 多选列表 - 组件递归
-->

<template>
  <div class="many-select" v-click-outside="() => (openSelect = false)">
    <div
      class="default-text"
      :style="{ width: width + 'rem', fontSize: size + 'rem', height: titleHeight + 'rem' }"
      v-if="!isChild"
      @click="toggleHandler"
    >
      <div class="dt-val text-overflow">{{ selectTextList || placeholder }}</div>
      <i class="el-icon-arrow-down" :class="{ active: openSelect }"></i>
    </div>
    <transition name="scaleY">
      <div class="ms-list" v-show="isChild || openSelect">
        <div
          class="ms-item"
          v-for="(item, index) in data"
          :key="index"
          @click.stop="clickHandler(item, true)"
          :class="{ active: item.active, showChild: item.showChild }"
          :style="{ width: width + 'rem', fontSize: size + 'rem', height: itemHeight + 'rem' }"
        >
          <div class="sm-square" @click.stop="iconHandler(item)"></div>
          <i class="el-icon-check" @click.stop="iconHandler(item)"></i>
          <div class="text-overflow">{{ item.name }}</div>
          <i class="el-icon-arrow-right" v-if="hasChild(item)"></i>
          <!-- 递归自身 -->
          <transition name="scaleX">
            <many-select
              class="ms-list-child"
              ref="msChild"
              :style="{ left: width + 'rem' }"
              v-show="hasChild(item) && item.showChild"
              :data="item.childList"
              :isChild="true"
              :dataIndex="index"
              @child-slect-all="childSelectAll"
              @child-slect-all-not="childSelectAllNot"
              @selectItem="$emit('selectItem', $event)"
              @reduceItem="$emit('reduceItem', $event)"
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
// @cancelAll: 取消选中所有的
// currentSelect: 当前所有选中的item
export default {
  name: "manySelect",
  props: {
    data: {
      type: Array,
      default: () => selectList: [
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
                  name: "三号",
                  value: "三号",
                },
                {
                  name: "四号",
                  value: "四号",
                },
                {
                  name: "四号",
                  value: "四号",
                },
              ],
            },
            {
              name: "二号",
              value: "二号",
            },
            {
              name: "四号",
              value: "四号",
            },
            {
              name: "四号",
              value: "四号",
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
    width: {
      type: Number,
      default: 1.7,
    },
    size: {
      type: Number,
      default: 0.2,
    },
    titleHeight: {
      type: Number,
      default: 0.52,
    },
    itemHeight: {
      type: Number,
      default: 0.48,
    },
  },
  data() {
    return {
      openSelect: false,
    };
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.isSelectAll();
      },
    },
    currentSelect(val, old) {
      // this.timer = setTimeout(() => {
      //   clearTimeout(this.timer);
      // }, 0);
      this.$nextTick(() => {
        // 用此方法包裹（或者用上面的方法），否则会多次触发 cancelAll
        !val.length && old.length > val.length && this.$emit("cancelAll");
      });
    },
  },
  methods: {
    // 递归获取所有选中的项
    getCurrentSelect(data = this.data) {
      let arr = [];
      data.forEach((item) => {
        if (this.hasChild(item)) {
          arr.push(...this.getCurrentSelect(item.childList));
        } else if (item.active) {
          arr.push(item);
        }
      });
      return arr;
    },
    hasChild(item) {
      return !!(item.childList && item.childList.length);
    },
    // 递归选中所有子项目
    selectAll(item) {
      item.childList.forEach((item) => {
        if (this.hasChild(item)) {
          this.selectAll(item);
        } else {
          !item.active && this.clickHandler(item);
        }
      });
    },
    // 框点击事件
    iconHandler(item) {
      if (item.childList && item.childList) {
        // 切换showChild
        this.$set(item, "showChild", !item.active);
        if (!item.active) {
          this.selectAll(item);
        } else {
          this.reduceAll(item);
        }
      } else {
        this.clickHandler(item);
      }
    },
    // 点击item
    clickHandler(item, isClick = false) {
      // 点击事件才会影响showChild
      if (isClick) {
        this.data.forEach((__item) => {
          // 关闭其他打开的child
          __item != item && this.$set(__item, "showChild", false);
        });
      }
      if (this.hasChild(item)) {
        // 切换child
        if (isClick) {
          this.$set(item, "showChild", !item.showChild);
        }
      } else {
        this.$set(item, "active", !item.active); // 切换选中
        this.$emit(item.active ? "selectItem" : "reduceItem", item); // 向父元素触发选中和取消
        // window.timerSelect = setTimeout(() => {
        //   clearTimeout(window.timerSelect);
        //   if (!item.active) {
        //     !this.currentSelect.length && this.$emit("cancelAll");
        //   }
        // }, 20);
      }
      // this.();
    },
    // 判断当前列表是否全部选中
    isSelectAll(data = this.data) {
      if (data.every((item) => item.active)) {
        // chidl所有都选中的状态下后触发
        this.$emit("child-slect-all", this.dataIndex);
      } else {
        this.$emit("child-slect-all-not", this.dataIndex);
      }
    },
    // 递归减少所有子项目
    reduceAll(item) {
      if (item.childList && item.childList) {
        item.childList.forEach((item) => {
          this.reduceAll(item);
        });
      }
      item.active && this.clickHandler(item);
    },
    // 切换选择列表
    toggleHandler() {
      this.data.forEach((__item) => {
        this.$set(__item, "showChild", false);
      });
      this.openSelect = !this.openSelect;
    },
    // chidl所有都选中的状态下后选中自身
    childSelectAll(index) {
      this.$set(this.data[index], "active", true);
    },

    childSelectAllNot(index) {
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
    // 所有选中的item， 不包含父级大类
    currentSelect() {
      return this.getCurrentSelect();
    },
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
.ms-list {
  background: linear-gradient(0deg, rgba(0, 115, 128, 0.6) 0%, rgba(1, 69, 128, 0.6) 100%);
  position: absolute;
  z-index: 99;
  cursor: pointer;
  transform-origin: center top;
  .ms-item {
    height: 0.48rem;
    display: flex;
    align-items: center;
    color: #fff;
    padding-left: 0.1rem;
    padding-right: 0.2rem;
    position: relative;
    .ms-list-child {
      transform-origin: left;
      position: absolute;
      top: 0;
    }
    .sm-square {
      width: 0.15rem;
      height: 0.15rem;
      border-radius: 0.03rem;
      border: 0.01rem solid rgba(255, 255, 255, 0.6);
      margin-right: 0.14rem;
      flex-shrink: 0;
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
  height: 0.52rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 5%;
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
