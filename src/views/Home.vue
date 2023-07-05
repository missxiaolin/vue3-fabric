<template>
  <div class="home">
    <Layout>
      <Header v-if="show">
        <!-- logo -->
        <span class="logo">
          <a href="https://github.com/missxiaolin" target="_blank">
            <Icon type="logo-github" :size="30" />
          </a>
        </span>
      </Header>
      <Content style="display: flex; height: calc(100vh - 64px)">
        <!-- 左侧菜单 -->
        <div v-if="show" style="width: 380px; height: 100%; background: #fff; display: flex">
          <Menu
            :active-name="menuActive"
            accordion
            @on-select="(activeIndex) => (menuActive = activeIndex)"
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
            <div v-show="menuActive === 2" class="left-panel">
              <tools></tools>
            </div>
            <!-- 背景设置 -->
            <div v-show="menuActive === 3" class="left-panel">
              <layer></layer>
            </div>
          </div>
        </div>
        <!-- 画布区域 -->
        <div id="workspace" style="width: 100%; position: relative; background: #f1f1f1">
          <div class="canvas-box">
            <div class="inside-shadow"></div>
            <canvas id="canvas" :class="ruler ? 'design-stage-grid' : ''"></canvas>
          </div>
        </div>
        <!-- 属性区域 380-->
        <div style="width: 530px; height: 100%; padding: 10px; overflow-y: auto; background: #fff">
          <div v-if="show" style="padding-top: 10px">
            <set-size></set-size>
            <bg-bar></bg-bar>
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
          <attribute v-if="show"></attribute>
        </div>
      </Content>
    </Layout>
  </div>
</template>

<script lang="ts">
// @ts-nocheck # 忽略全文

import { defineComponent } from 'vue';
import { fabric } from 'fabric';

import layer from '@/components/layer.vue';

// 左侧组件
import tools from '@/components/tools.vue';

// 右侧组件
import setSize from '@/components/setSize.vue';
import bgBar from '@/components/bgBar.vue';
import lock from '@/components/lock.vue';
import align from '@/components/align.vue';
import dele from '@/components/del.vue';
import clone from '@/components/clone.vue';
import centerAlign from '@/components/centerAlign.vue';
import attribute from '@/components/attribute.vue';
import flip from '@/components/flip.vue';

// 功能组件
import Editor from '../core';

// 功能组件
import CanvasEventEmitter from '../utils/event/notifier';
const event = new CanvasEventEmitter();
const canvas = {};
export default defineComponent({
  name: 'HomeView',
  provide: {
    canvas,
    fabric,
    event
  },
  data() {
    return {
      canvas: null,
      menuActive: 2,
      show: false,
      select: null,
      ruler: false,
    };
  },
  components: {
    layer,
    setSize,
    bgBar,
    tools,
    lock,
    dele,
    clone,
    align,
    attribute,
    flip,
    centerAlign
  },
  mounted() {
    this.canvas = new fabric.Canvas('canvas', {
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    });
    canvas.c = this.canvas;
    event.init(canvas.c);

    canvas.editor = new Editor(canvas.c);
    canvas.c.renderAll();

    this.show = true;
  }
});
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
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>