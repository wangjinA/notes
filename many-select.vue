<!--
 * @Author: 汪锦
 * @Date: 2020-07-29 09:38:18
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-07-29 15:06:29
 * @Description: 综合治理 - 多选列表 - 组件递归
-->

<template>
  <div class="many-select">
    <div class="default-text" v-if="!isChild" @click="openHandler">
      <div class="dt-val">重点人</div>
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
          <div class="sm-square"></div>
          <i class="el-icon-check"></i>
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
          name: "重点人",
          value: "重点人",
        },
        {
          name: "重点人",
          value: "重点人",
          childList: [
            {
              name: "重点人",
              value: "重点人",
            },
            {
              name: "重点人",
              value: "重点人",
            },
          ],
        },
        {
          name: "重点人",
          value: "重点人",
        },
        {
          name: "重点人",
          value: "重点人",
        },
      ],
    },
    isChild: Boolean,
    dataIndex: Number,
  },
  data() {
    return {
      openSelect: false,
    };
  },
  methods: {
    openHandler() {
      this.data.forEach((__item) => {
        this.$set(__item, "showChild", false);
      });
      this.openSelect = !this.openSelect;
    },
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
      }
      if (this.data.every((item) => item.active)) {
        // chidl所有都选中的状态下后触发
        this.$emit("child-slect-all", this.dataIndex);
      } else {
        this.$emit("child-slect-all-not", this.dataIndex);
      }
    },
    childSlectall(index) {
      // chidl所有都选中的状态下后选中自身
      this.data[index].active = true;
      this.$set(this.data[index], "active", true);
    },
    childSlectallNot(index) {
      this.$set(this.data[index], "active", false);
    },
  },
  computed: {
    listHeight() {
      return this.data.length * 0.48;
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
      .sm-square {
        display: none;
      }
      i.el-icon-check {
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
// 高度Y 和宽度X 拉伸 需
// Y,要在容器上设置  : transform-origin: top;
// X,要在容器上设置  : transform-origin: left;
.scaleX-enter-active,
.scaleX-leave-active,
.scaleY-enter-active,
.scaleY-leave-active {
  transition: 0.3s;
}
.scaleY-leave-to,
.scaleY-enter {
  transform: scaleY(0);
  opacity: 0;
}
.scaleY-leave,
.scaleY-enter-to {
  transform: scaleY(1);
  opacity: 1;
}

.scaleX-leave-to,
.scaleX-enter {
  transform: scaleX(0);
  opacity: 0;
}
.scaleX-leave, 
.scaleX-enter-to {
  transform: scaleX(1);
  opacity: 1;
}
</style>
