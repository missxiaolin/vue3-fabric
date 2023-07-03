<template>
  <div>
    <Divider plain orientation="left">{{ $t("common_elements") }}</Divider>
    <div class="tool-box">
      <span
        @click="() => addText()"
        :draggable="true"
        @dragend="onDragend('text')"
      >
        <svg
          t="1650875455324"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5401"
          width="26"
          height="26"
        >
          <path
            d="M213.333333 209.92v128h85.333334v-42.666667h170.666666v433.493334H384.853333v85.333333h256v-85.333333H554.666667V295.253333h170.666666v42.666667h85.333334v-128H213.333333z"
            p-id="5402"
          ></path>
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid';

// 默认属性
const defaultPosition = { shadow: "", fontFamily: "arial" };
// 拖拽属性
const dragOption = {
  left: 0,
  top: 0,
};

export default {
  name: "ToolBar",
  inject: ["canvas", "fabric"],
  data() {
    return {
      isDrawingLineMode: false,
      isArrow: false,
    };
  },
  created() {},
  methods: {
    // 拖拽开始时就记录当前打算创建的元素类型
    onDragend(type) {},
    addText(option) {
      const text = new this.fabric.IText(this.$t("everything_is_fine"), {
        ...defaultPosition,
        ...option,
        fontSize: 80,
        id: uuid(),
      });
      this.canvas.c.add(text);
      if (!option) {
        text.center();
      }
      this.canvas.c.setActiveObject(text);
    },
  },
};
</script>

<style scoped lang="scss">
.tool-box {
  display: flex;
  justify-content: space-around;
  span {
    flex: 1;
    text-align: center;
    padding: 5px 0;
    background: #f6f6f6;
    margin-left: 2px;
    cursor: pointer;
    &:hover {
      background: #edf9ff;
      svg {
        fill: #2d8cf0;
      }
    }
  }
  .bg {
    background: #d8d8d8;

    &:hover {
      svg {
        fill: #2d8cf0;
      }
    }
  }
}
.img {
  width: 20px;
}
</style>
