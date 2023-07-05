<template>
  <div class="box" v-if="mixinState.mSelectMode === 'one'">
    <!-- 字体属性 -->
    <div v-show="textType.includes(mixinState.mSelectOneType)">
      <Divider plain orientation="left">{{ $t("attributes.font") }}</Divider>
      <!-- 字体 -->
      <div class="flex-view">
        <div class="flex-item">
          <div class="left font-selector">
            <Select
              v-model="fontAttr.fontFamily"
              @on-change="changeFontFamily"
              placeholder="请选择"
            >
              <Option
                v-for="item in fontFamilyList"
                :value="item.name"
                :key="`font-${item.name}`"
              >
                <div class="font-item" v-if="!item.preview">
                  {{ item.name }}
                </div>
                <div
                  class="font-item"
                  v-else
                  :style="`background-image:url('${item.preview}');`"
                >
                  {{ !item.preview ? item : "" }}
                  <!-- 解决无法选中问题 -->
                  <span style="display: none">{{ item.name }}</span>
                </div>
              </Option>
            </Select>
          </div>
          <div class="right">
            <InputNumber
              v-model="fontAttr.fontSize"
              @on-change="(value) => changeCommon('fontSize', value)"
              append="字号"
              :min="1"
            ></InputNumber>
          </div>
        </div>
      </div>
      <!-- 对其方式 -->
      <div class="flex-view">
        <div class="flex-item">
          <RadioGroup
            class="button-group"
            v-model="fontAttr.textAlign"
            @on-change="(value) => changeCommon('textAlign', value)"
            type="button"
          >
            <Radio v-for="(item, i) in textAlignList" :label="item" :key="item">
              <span v-html="textAlignListSvg[i]"></span>
            </Radio>
          </RadioGroup>
        </div>
      </div>
      <!-- 加粗、斜体、中划、下划 -->
      <div class="flex-view">
        <div class="flex-item">
          <ButtonGroup class="button-group">
            <Button @click="changeFontWeight('fontWeight', fontAttr.fontWeight)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M793.99865 476a244 244 0 0 0 54-130.42C862.75865 192.98 743.01865 64 593.85865 64H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h63.74v576H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h418.64c141.6 0 268.28-103.5 282-244.8 9.48-96.9-32.78-184.12-101.66-239.2zM418.33865 224h175.52a96 96 0 0 1 0 192h-175.52z m175.52 576h-175.52V576h175.52a112 112 0 0 1 0 224z"
                  :fill="fontAttr.fontWeight === 'bold' ? '#305ef4' : '#666'"
                ></path>
              </svg>
            </Button>
            <Button @click="changeFontStyle('fontStyle', fontAttr.fontStyle)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M832 96v64a32 32 0 0 1-32 32h-125.52l-160 640H608a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h125.52l160-640H416a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h384a32 32 0 0 1 32 32z"
                  :fill="fontAttr.fontStyle === 'italic' ? '#305ef4' : '#666'"
                ></path>
              </svg>
            </Button>
            <Button @click="changeLineThrough('linethrough', fontAttr.linethrough)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M893.088 501.792H125.344a32 32 0 0 0 0 64h767.744a32 32 0 0 0 0-64zM448 448h112V208h288V96H160v112h288zM448 640h112v288H448z"
                  :fill="fontAttr.linethrough ? '#305ef4' : '#666'"
                ></path>
              </svg>
            </Button>
            <Button @click="changeUnderline('underline', fontAttr.underline)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M703.232 67.008h127.488v413.248c0 158.016-142.656 286.016-318.72 286.016-176 0-318.72-128-318.72-286.016V67.008h127.488v413.248c0 39.872 18.176 78.144 51.136 107.776 36.8 32.96 86.528 51.072 140.096 51.072s103.36-18.112 140.032-51.136c33.024-29.632 51.2-67.968 51.2-107.776V67.008zM193.28 871.616h637.44v85.376H193.28v-85.376z"
                  :fill="fontAttr.underline ? '#305ef4' : '#666'"
                ></path>
              </svg>
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <!-- 行高、间距 -->
      <Row :gutter="12">
        <Col flex="1">
          <InputNumber
            v-model="fontAttr.lineHeight"
            @on-change="(value) => changeCommon('lineHeight', value)"
            :step="0.1"
            :append="$t('attributes.line_height')"
          ></InputNumber>
        </Col>
        <Col flex="1">
          <InputNumber
            v-model="fontAttr.charSpacing"
            @on-change="(value) => changeCommon('charSpacing', value)"
            :append="$t('attributes.char_spacing')"
          ></InputNumber>
        </Col>
      </Row>
      <!-- 背景 -->
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('background') }}</span>
          <div class="content">
            <ColorPicker
              v-model="fontAttr.textBackgroundColor"
              @on-change="(value) => changeCommon('textBackgroundColor', value)"
              alpha
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="AttrBute">
import { reactive, ref, onMounted, inject, getCurrentInstance } from "vue";
import InputNumber from '@/components/inputNumber';
import fontList from "@/assets/fonts/font";
import useSelect from "@/hooks/select";
import FontFaceObserver from "fontfaceobserver";
import { Spin } from "view-ui-plus";
const update = getCurrentInstance();
import axios from "axios";

const event = inject("event");
// 文字元素
const textType = ["i-text", "textbox", "text"];
// 通用属性
const baseAttr = reactive({
  id: "",
  opacity: 0,
  angle: 0,
  fill: "#fff",
  left: 0,
  top: 0,
  strokeWidth: 0,
  strokeDashArray: [],
  stroke: "#fff",
  shadow: {
    color: "#fff",
    blur: 0,
    offsetX: 0,
    offsetY: 0,
  },
  points: {},
});
// 字体属性
const fontAttr = reactive({
  fontSize: 0,
  fontFamily: "",
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: "",
  textBackgroundColor: "#fff",
  textAlign: "",
  fontStyle: "",
  underline: false,
  linethrough: false,
  overline: false,
});
// 字体对齐方式
const textAlignList = ['left', 'center', 'right'];
// 对齐图标
const textAlignListSvg = [
  '<svg t="1650441458823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="18" height="18"><path d="M198.4 198.4h341.333333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666667h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-569.6c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666666h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533334z m0 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3555"></path></svg>',
  '<svg t="1650441512015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3704" width="18" height="18"><path d="M313.6 198.4h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533333z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m115.2 170.666666h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533334z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3705"></path></svg>',
  '<svg t="1650441519862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3854" width="18" height="18"><path d="M454.4 283.733333v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h341.333334c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333334c-8.533333 0-14.933333-2.133333-19.2-8.533334-4.266667-4.266667-8.533333-10.666667-8.533333-19.2z m-226.133333 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333H256c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533333-19.2z m113.066666 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533334-19.2 6.4-6.4 12.8-8.533333 19.2-8.533334h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533334-19.2z m-170.666666 170.666666v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-4.266667-8.533333-10.666667-8.533333-19.2z" p-id="3855"></path></svg>',
];

const { canvas, fabric, mixinState } = useSelect();
// 字体下拉列表
const fontFamilyList = ref([...fontList]);

// 修改字体
const changeFontFamily = (fontName) => {
  if (!fontName) return;
  // 跳过加载的属性;
  const skipFonts = ["arial", "Microsoft YaHei"];
  if (skipFonts.includes(fontName)) {
    const activeObject = canvas.c.getActiveObjects()[0];
    activeObject && activeObject.set("fontFamily", fontName);
    canvas.c.renderAll();
    return;
  }
  Spin.show();
  // 字体加载
  const font = new FontFaceObserver(fontName);
  font
    .load(null, 150000)
    .then(() => {
      const activeObject = canvas.c.getActiveObjects()[0];
      activeObject && activeObject.set("fontFamily", fontName);
      canvas.c.renderAll();
      Spin.hide();
    })
    .catch((err) => {
      console.log(err);
      Spin.hide();
    });
};

const getObjectAttr = (e) => {
  const activeObject = canvas.c.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject) {
    // base
    baseAttr.id = activeObject.get("id");
    baseAttr.opacity = activeObject.get("opacity") * 100;
    baseAttr.fill = activeObject.get("fill");
    baseAttr.left = activeObject.get("left");
    baseAttr.top = activeObject.get("top");
    baseAttr.stroke = activeObject.get("stroke");
    baseAttr.strokeWidth = activeObject.get("strokeWidth");
    baseAttr.shadow = activeObject.get("shadow") || {};
    baseAttr.angle = activeObject.get("angle") || 0;
    baseAttr.points = activeObject.get("points") || {};

    const textTypes = ["i-text", "text", "textbox"];
    if (textTypes.includes(activeObject.type)) {
      fontAttr.fontSize = activeObject.get("fontSize");
      fontAttr.fontFamily = activeObject.get("fontFamily");
      fontAttr.lineHeight = activeObject.get("lineHeight");
      fontAttr.textAlign = activeObject.get("textAlign");
      fontAttr.underline = activeObject.get("underline");
      fontAttr.linethrough = activeObject.get("linethrough");
      fontAttr.charSpacing = activeObject.get("charSpacing");
      fontAttr.overline = activeObject.get("overline");
      fontAttr.fontStyle = activeObject.get("fontStyle");
      fontAttr.textBackgroundColor = activeObject.get("textBackgroundColor");
      fontAttr.fontWeight = activeObject.get("fontWeight");
    }
  }
};

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvas.c.getActiveObjects()[0];
  activeObject && activeObject.set(key, value);
  canvas.c.renderAll();

  // 更新属性
  getObjectAttr();
};

const getFreeFontList = () => {
  // axios.get(`/font/free-font.json`).then((res) => {
  //   fontFamilyList.value = [
  //     ...fontFamilyList.value,
  //     ...Object.entries(res.data).map(([, value]) => value),
  //   ];
  // });
};

const selectCancel = () => {
  baseAttr.fill = '';
  update?.proxy?.$forceUpdate();
};

// 加粗
const changeFontWeight = (key, value) => {
  const nValue = value === 'normal' ? 'bold' : 'normal';
  fontAttr.fontWeight = nValue;
  const activeObject = canvas.c.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvas.c.renderAll();
};

// 斜体
const changeFontStyle = (key, value) => {
  const nValue = value === 'normal' ? 'italic' : 'normal';
  fontAttr.fontStyle = nValue;
  const activeObject = canvas.c.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvas.c.renderAll();
};

// 中划
const changeLineThrough = (key, value) => {
  const nValue = value === false;
  fontAttr.linethrough = nValue;
  const activeObject = canvas.c.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvas.c.renderAll();
};

// 下划
const changeUnderline = (key, value) => {
  const nValue = value === false;
  fontAttr.underline = nValue;
  const activeObject = canvas.c.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvas.c.renderAll();
};

const init = () => {
  // 获取字体数据
  getFreeFontList();

  event.on('selectCancel', selectCancel);
  event.on('selectOne', getObjectAttr);
  canvas.c.on('object:modified', getObjectAttr);
};

onMounted(init);
</script>

<style scoped lang="scss">
// @import url('vue-color-gradient-picker/dist/index.css');
:deep(.ivu-color-picker) {
  display: block;
}
:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
  }
}
.box {
  width: 100%;
}

.button-group {
  display: flex;
  width: 100%;
  .ivu-btn,
  .ivu-radio-wrapper {
    flex: 1;
  }
}

.flex-view {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
}
.flex-item {
  display: inline-flex;
  flex: 1;
  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    // color: #333333;
  }
  .content {
    width: 60px;
  }
  .slider-box {
    width: calc(100% - 50px);
    margin-left: 10px;
  }
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
    margin-left: 10px;
    :deep(.ivu-input-number) {
      display: block;
      width: 100%;
    }
  }
  :deep(.ivu-slider-wrap) {
    margin: 13px 0;
  }
  :deep(.ivu-radio-group-button) {
    & .ivu-radio-wrapper {
      width: 48px;
      line-height: 40px;
      text-align: center;
      svg {
        vertical-align: baseline;
      }
    }
  }

  :deep(.ivu-btn-group-large) {
    & > .ivu-btn {
      font-size: 24px;
    }
  }

  :deep(.ivu-radio-group-button) {
    &.ivu-radio-group-large .ivu-radio-wrapper {
      font-size: 24px;
    }
  }
}

.ivu-row {
  margin-bottom: 8px;

  .ivu-col {
    position: inherit;
    &__box {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 4px;
      gap: 8px;
    }
  }

  .label {
    padding-left: 8px;
  }

  .content {
    flex: 1;

    :deep(.--input),
    :deep(.ivu-select-selection) {
      background-color: transparent;
      border: none !important;
      box-shadow: none !important;
    }
  }
}

.font-selector {
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }

  .font-item {
    background-color: #000;
    background-size: cover;
    background-position: center center;
    height: 40px;
    width: 200px;
    color: #fff;
    font-size: 27px;
    text-align: center;
    filter: invert(100%);
  }
}
</style>
