<template>
  <div class="home">
    <Layout>
      <Header v-if="state.show">
        <!-- logo -->
        <span class="logo">
          <a href="https://github.com/missxiaolin" target="_blank">
            <Icon type="logo-github" :size="30" />
          </a>
        </span>
        <!-- 导入 -->
        <import-json></import-json>
        <Divider type="vertical" />
        <import-file></import-file>
        <Divider type="vertical" />
        <!-- 标尺开关 -->
        <Tooltip :content="$t('grid')">
          <iSwitch v-model="state.ruler" size="small" class="switch"></iSwitch>
        </Tooltip>
        <Divider type="vertical" />
        <history></history>
        <div class="top-right">
          <!-- 预览 -->
          <previewCurrent />
          <save></save>
          <lang></lang>
        </div>
      </Header>
      <Content style="display: flex; height: calc(100vh - 64px)">
        <!-- 左侧菜单 -->
        <div
          v-if="state.show"
          style="width: 380px; height: 100%; background: #fff; display: flex"
        >
          <Menu
            :active-name="state.menuActive"
            accordion
            @on-select="(activeIndex) => (state.menuActive = activeIndex)"
            width="65px"
          >
            <!-- <MenuItem :name="1" class="menu-item">
              <Icon type="md-book" size="24" />
              <div>模版</div>
            </MenuItem> -->
            <MenuItem :name="2" class="menu-item">
              <Icon type="md-images" size="24" />
              <div>元素</div>
            </MenuItem>
            <MenuItem :name="3" class="menu-item">
              <Icon type="md-reorder" size="24" />
              <div>图层</div>
            </MenuItem>
          </Menu>
          <div class="content">
            <!-- 生成模板 -->
            <!-- <div v-show="menuActive === 1" class="left-panel">
              1
            </div> -->
            <!-- 常用元素 -->
            <div v-show="state.menuActive === 2" class="left-panel">
              <tools></tools>
            </div>
            <!-- 背景设置 -->
            <div v-show="state.menuActive === 3" class="left-panel">
              <layer></layer>
            </div>
          </div>
        </div>
        <!-- 画布区域 -->
        <div
          id="workspace"
          style="width: 100%; position: relative; background: #f1f1f1"
        >
          <div class="canvas-box">
            <div class="inside-shadow"></div>
            <canvas id="canvas" :class="state.ruler ? 'design-stage-grid' : ''"></canvas>
            <dragMode></dragMode>
            <zoom></zoom>
          </div>
        </div>
        <!-- 属性区域 380-->
        <div
          style="
            width: 530px;
            height: 100%;
            padding: 10px;
            overflow-y: auto;
            background: #fff;
          "
        >
          <div v-if="state.show" style="padding-top: 10px">
            <set-size></set-size>
            <bg-bar></bg-bar>
            <group></group>
            <replaceImg></replaceImg>
            <filters></filters>
            <div class="attr-item">
              <lock></lock>
              <dele></dele>
              <clone></clone>
            </div>
            <!-- 组对齐方式 -->
            <align></align>
            <!-- 居中对齐 -->
            <center-align></center-align>
            <!-- 翻转 -->
            <flip></flip>
          </div>
          <attribute v-if="state.show"></attribute>
        </div>
      </Content>
    </Layout>
  </div>
</template>

<script name="Home" setup>
// @ts-nocheck # 忽略全文
import { reactive, onMounted, watch, provide } from "vue";
import { defineComponent } from "vue";
import { fabric } from "fabric";

import layer from "@/components/layer.vue";

// 顶部组件
import previewCurrent from "@/components/previewCurrent";
import lang from "@/components/lang.vue";
import save from "@/components/save.vue";
import history from '@/components/history.vue';
// 导入元素
import importJson from "@/components/importJson.vue";
import importFile from "@/components/importFile.vue";

// 左侧组件
import tools from "@/components/tools.vue";

// 右侧组件
import setSize from "@/components/setSize.vue";
import bgBar from "@/components/bgBar.vue";
import lock from "@/components/lock.vue";
import align from "@/components/align.vue";
import dele from "@/components/del.vue";
import clone from "@/components/clone.vue";
import centerAlign from "@/components/centerAlign.vue";
import attribute from "@/components/attribute.vue";
import flip from "@/components/flip.vue";
import replaceImg from "@/components/replaceImg.vue";
import filters from "@/components/filters.vue";
import group from '@/components/group.vue';

// 主区域组件
import dragMode from '@/components/dragMode.vue';
import zoom from '@/components/zoom.vue';

// 功能组件
import Editor from "../core";

// 功能组件
import CanvasEventEmitter from "../utils/event/notifier";
const event = new CanvasEventEmitter();
const canvas = {};

const state = reactive({
  menuActive: 2,
  show: false,
  select: null,
  ruler: false,
});

onMounted(() => {
  const _canvas = new fabric.Canvas("canvas", {
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
  });
  canvas.c = _canvas;
  event.init(canvas.c);

  canvas.editor = new Editor(canvas.c);
  canvas.c.renderAll();

  state.show = true;
});

watch(
  () => state.ruler,
  (value) => {
    if (!canvas.c.ruler) return;
    if (value) {
      canvas.c.ruler.enable();
    } else {
      canvas.c.ruler.disable();
    }
  }
);

provide("fabric", fabric);
provide("event", event);
provide("canvas", canvas);
</script>

<style lang="scss" scoped>
.logo {
  width: 30px;
  height: 30px;
  display: inline-block;
  margin-right: 10px;
  text-align: center;
  vertical-align: middle;
  .ivu-icon {
    vertical-align: super;
  }
}

// 属性面板样式
:deep(.attr-item) {
  position: relative;
  margin-bottom: 12px;
  height: 40px;
  padding: 0 10px;
  background: #f6f7f9;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .ivu-tooltip {
    text-align: center;
    flex: 1;
  }
}

.ivu-menu-vertical .menu-item {
  text-align: center;
  padding: 10px 2px;
  box-sizing: border-box;
  font-size: 12px;

  & > i {
    margin: 0;
  }
}

:deep(.ivu-layout-header) {
  --height: 45px;
  padding: 0 10px;
  border-bottom: 1px solid #eef2f8;
  background: #fff;
  height: var(--height);
  line-height: var(--height);
}

.home,
.ivu-layout {
  height: 100vh;
}

.icon {
  display: block;
}

.canvas-box {
  position: relative;
}
// 画布内阴影
.inside-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 9px 2px #0000001f;
  z-index: 2;
  pointer-events: none;
}

#canvas {
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

#workspace {
  overflow: hidden;
}

.content {
  flex: 1;
  width: 220px;
  padding: 10px;
  padding-top: 0;
  height: 100%;
  overflow-y: auto;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: none;
}
// 标尺
.switch {
  margin-right: 10px;
}
// 网格背景
.design-stage-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  background-image: linear-gradient(
      45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0
    ),
    linear-gradient(
      45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0
    );
  background-position: var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
.top-right {
  display: flex;
  flex-direction: row;
  float: right;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
