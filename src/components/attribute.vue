<template>
  <div class="box" v-if="mixinState.mSelectMode === 'one'">
    <!-- 字体属性 -->
    <div v-show="textType.includes(mixinState.mSelectOneType)">
      <Divider plain orientation="left">{{ $t("attributes.font") }}</Divider>
      <div class="flex-view">
        <div class="flex-item">
          <div class="left font-selector">
            <Select v-model="fontAttr.fontFamily" @on-change="changeFontFamily">
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
    </div>
  </div>
</template>

<script setup name="AttrBute">
import { reactive, ref } from "vue";
import fontList from "@/assets/fonts/font";
import useSelect from "@/hooks/select";
import FontFaceObserver from 'fontfaceobserver';
import { Spin } from 'view-ui-plus';

// 文字元素
const textType = ["i-text", "textbox", "text"];
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

const { canvas, fabric, mixinState } = useSelect();
console.log(fontList)
// 字体下拉列表
const fontFamilyList = ref([...fontList]);

// 修改字体
const changeFontFamily = (fontName) => {
  if (!fontName) return;
  // 跳过加载的属性;
  const skipFonts = ['arial', 'Microsoft YaHei'];
  if (skipFonts.includes(fontName)) {
    const activeObject = canvas.c.getActiveObjects()[0];
    activeObject && activeObject.set('fontFamily', fontName);
    canvas.c.renderAll();
    return;
  }
  Spin.show();
  console.log(fontName)
  // 字体加载
  const font = new FontFaceObserver(fontName);
  font
    .load(null, 150000)
    .then(() => {
      const activeObject = canvas.c.getActiveObjects()[0];
      activeObject && activeObject.set('fontFamily', fontName);
      canvas.c.renderAll();
      Spin.hide();
    })
    .catch((err) => {
      console.log(err);
      Spin.hide();
    });
};

// 通用属性改变
const changeCommon = (key, value) => {};
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
