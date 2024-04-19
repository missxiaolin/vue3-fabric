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
        <import-files></import-files>
        <Divider type="vertical" />
        <import-file></import-file>
        <Divider type="vertical" />
        <!-- 标尺开关 -->
        <Tooltip :content="$t('grid')">
          <iSwitch
            v-model="state.ruler"
            size="small"
            class="switch"
            @on-change="rulerSwitch"
          ></iSwitch>
        </Tooltip>
        <Divider type="vertical" />
        <history></history>
        <div class="top-right">
          <!-- 预览 -->
          <previewCurrent />
          <waterMark />
          <save></save>
          <lang></lang>
        </div>
      </Header>
      <Content style="display: flex; height: calc(100vh - 64px)">
        <!-- 左侧菜单 -->
        <div
          v-if="state.show"
          :class="`left-bar ${state.toolsBarShow && 'show-tools-bar'}`"
        >
          <Menu
            :active-name="state.menuActive"
            accordion
            @on-select="showToolsBar"
            width="65px"
          >
            <MenuItem :name="1" class="menu-item">
              <Icon type="md-book" size="24" />
              <div>模版</div>
            </MenuItem>
            <MenuItem :name="2" class="menu-item">
              <Icon type="md-images" size="24" />
              <div>元素</div>
            </MenuItem>
            <MenuItem :name="3" class="menu-item">
              <Icon type="ios-keypad-outline" size="24" />
              <div>工具</div>
            </MenuItem>
            <MenuItem :name="4" class="menu-item">
              <Icon type="md-reorder" size="24" />
              <div>图层</div>
            </MenuItem>
          </Menu>
          <div class="content" v-show="state.toolsBarShow">
            <!-- 生成模板 -->
            <div v-show="state.menuActive === 1" class="left-panel">
              <import-tmpl></import-tmpl>
            </div>
            <!-- 常用元素 -->
            <div v-show="state.menuActive === 2" class="left-panel">
              <tools></tools>
            </div>
            <!-- 工具 -->
            <div v-show="state.menuActive === 3" class="left-panel">
              <tool />
            </div>
            <!-- 图层 -->
            <div v-show="state.menuActive === 4" class="left-panel">
              <layer></layer>
            </div>
          </div>

          <!-- 关闭按钮 -->
          <div
            class="close-btn"
            v-show="state.toolsBarShow"
            @click="hideToolsBar"
          ></div>
        </div>
        <!-- 画布区域 -->
        <div
          id="workspace"
          style="width: 100%; position: relative; background: #f1f1f1"
        >
          <div class="canvas-box">
            <div class="inside-shadow"></div>
            <canvas
              id="canvas"
              :class="state.ruler ? 'design-stage-grid' : ''"
            ></canvas>
            <dragMode></dragMode>
            <zoom></zoom>
          </div>
        </div>

        <!-- 属性区域 380-->
        <div class="right-bar" v-show="state.attrBarShow">
          <div v-if="state.show" style="padding-top: 10px">
            <set-size></set-size>
            <bg-bar></bg-bar>
            <group></group>
            <replaceImg></replaceImg>
            <filters></filters>
            <!-- 二维码 && 条形码 -->
            <codeInput></codeInput>
            <div class="attr-item">
              <!-- <lock></lock> -->
              <!-- <dele></dele> -->
              <!-- <clone></clone> -->
            </div>

            <!-- 组对齐方式 -->
            <!-- <align></align> -->
            <!-- 居中对齐 -->
            <!-- <center-align></center-align> -->
            <!-- 翻转 -->
            <!-- <flip></flip> -->
          </div>
          <!-- <attribute v-if="state.show"></attribute> -->
        </div>
        <!-- 右侧关闭按钮 -->
        <div
          :class="`close-btn right-btn ${
            state.attrBarShow && 'right-btn-open'
          }`"
          @click="switchAttrBar"
        ></div>
      </Content>
    </Layout>
  </div>
</template>

<script name="Home" setup>
// @ts-nocheck # 忽略全文
import { reactive, onMounted, watch, provide, defineComponent } from "vue";
import { fabric } from "fabric";

import layer from "@/components/layer.vue";

// 顶部组件
import previewCurrent from "@/components/previewCurrent";
import lang from "@/components/lang.vue";
import save from "@/components/save.vue";
import history from "@/components/history.vue";
// 导入元素
import importFiles from "@/components/importFiles.vue";
import importFile from "@/components/importFile.vue";
import waterMark from "@/components/waterMark";

// 左侧组件
import tool from "@/components/tool.vue";
import tools from "@/components/tools.vue";
import importTmpl from "@/components/importTmpl.vue";

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
import group from "@/components/group.vue";
import codeInput from "@/components/codeInput.vue";

// 主区域组件
import dragMode from "@/components/dragMode.vue";
import zoom from "@/components/zoom.vue";

const repoSrc = "";

// 功能组件
import Editor, {
  DringPlugin,
  AlignGuidLinePlugin,
  ControlsPlugin,
  ControlsRotatePlugin,
  CenterAlignPlugin,
  LayerPlugin,
  CopyPlugin,
  MoveHotKeyPlugin,
  DeleteHotKeyPlugin,
  GroupPlugin,
  DrawLinePlugin,
  GroupTextEditorPlugin,
  GroupAlignPlugin,
  WorkspacePlugin,
  DownFontPlugin,
  HistoryPlugin,
  FlipPlugin,
  RulerPlugin,
  MaterialPlugin,
} from "xiaolin-core-fabric";

// 创建编辑器
const canvasEditor = new Editor();

const state = reactive({
  menuActive: 1,
  show: false,
  toolsBarShow: true,
  attrBarShow: true,
  select: null,
  ruler: true,
});

onMounted(() => {
  // 初始化fabric
  const canvas = new fabric.Canvas("canvas", {
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
  });

  // 初始化编辑器
  canvasEditor.init(canvas);
  canvasEditor.use(DringPlugin);
  canvasEditor.use(AlignGuidLinePlugin);
  canvasEditor.use(ControlsPlugin);
  canvasEditor.use(ControlsRotatePlugin);
  canvasEditor.use(CenterAlignPlugin);
  canvasEditor.use(LayerPlugin);
  canvasEditor.use(CopyPlugin);
  canvasEditor.use(MoveHotKeyPlugin);
  canvasEditor.use(DeleteHotKeyPlugin);
  canvasEditor.use(GroupPlugin);
  canvasEditor.use(DrawLinePlugin);
  canvasEditor.use(GroupTextEditorPlugin);
  canvasEditor.use(GroupAlignPlugin);
  canvasEditor.use(WorkspacePlugin);
  canvasEditor.use(DownFontPlugin);
  canvasEditor.use(HistoryPlugin);
  canvasEditor.use(FlipPlugin);
  canvasEditor.use(RulerPlugin);
  canvasEditor.use(MaterialPlugin, {
    repoSrc,
  });

  state.show = true;
  // 默认打开标尺
  if (state.ruler) {
    canvasEditor.rulerEnable();
  }
});

// 获取字体数据 新增字体样式使用
// getFontJson() {
//   const activeObject = this.canvas.getActiveObject();
//   if (activeObject) {
//     const json = activeObject.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
//     console.log(json);
//     const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
//       JSON.stringify(json, null, '\t')
//     )}`;
//     downFile(fileStr, 'font.json');
//     const dataUrl = activeObject.toDataURL();
//     downFile(dataUrl, 'font.png');
//   }
// },

const rulerSwitch = (val) => {
  if (val) {
    canvasEditor.rulerEnable();
  } else {
    canvasEditor.rulerDisable();
  }
};

// 隐藏工具条
const hideToolsBar = () => {
  state.toolsBarShow = !state.toolsBarShow;
};
// 展示工具条
const showToolsBar = (val) => {
  state.menuActive = val;
  state.toolsBarShow = true;
};
// 属性面板开关
const switchAttrBar = () => {
  state.attrBarShow = !state.attrBarShow;
};

provide("fabric", fabric);
// provide('event', event);
provide("canvasEditor", canvasEditor);
</script>

<style lang="scss" scoped>
@import "./home.scss";
</style>
