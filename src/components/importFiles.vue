<template>
  <div style="display: inline-block">
    <Dropdown transfer-class-name="fix" @on-click="insertTypeHand">
      <a href="javascript:void(0)">
        {{ $t("import_files.name") }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <template #list>
        <DropdownMenu>
          <!-- 文件 -->
          <DropdownItem name="insertPsd">{{
            $t("import_files.import_psd")
          }}</DropdownItem>
          <!-- JSON -->
          <DropdownItem name="insertJson">{{
            $t("import_files.import_json")
          }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </div>
</template>

<script name="ImportFiles" setup>
import useSelect from "@/hooks/select";
const { fabric, canvasEditor } = useSelect();
import { parseImage } from "@/utils/psd/image";
import { parseText } from "@/utils/psd/text";

/**
 * psd 对象处理
 * @param layer
 * @returns
 */
function addObj(layer, canvasEditor) {
  let obj;
  if (layer.text) {
    // 文字
    obj = parseText(layer, canvasEditor, fabric);
  } else {
    // 图片
    obj = parseImage(layer, canvasEditor, fabric);
  }
  return obj;
}

/**
 * 导入psd 元素
 * @param value
 * @param canvasEditor
 */
function parseLayers(value, canvasEditor) {
  const { psd, layers } = value;
  canvasEditor.setSize(psd.width, psd.height);
  return new Promise((resolve) => {
    let group = [];
    let i = 0;
    let totalLayers = layers.length; // 总图层数量
    const processNextLayer = () => {
      if (i >= totalLayers) {
        // 使用 totalLayers 变量代替 layers.length
        resolve(); // 解析完成后 resolve Promise
        return;
      }
      let layer = layers[i];
      console.log(layer.name + ':', layer);

      // 层级：数值越大越靠前，与ps的层级相反
      let index = totalLayers - i; // 使用 totalLayers 变量代替 layers.length
      layer.zIndex = index;
      if (layer.children) {
        // 组
        parseLayers(layer.children, canvasEditor).then(() => {
          i++;
          setTimeout(processNextLayer, 0); // 将下一层处理放入事件循环的下一个任务中
        });
      } else {
        const obj = addObj(layer, canvasEditor);
      }
      i++;
      setTimeout(processNextLayer, 0); // 将下一层处理放入事件循环的下一个任务中
    };
    totalLayers = layers.length; // 将总图层数量赋值给 totalLayers 变量
    processNextLayer();
  });
}

const HANDLEMAP = {
  // 导入json
  insertJson: function () {
    insert();
  },
  // 导入psd文件
  insertPsd: function () {
    canvasEditor.insertPsd(async (valus) => {
      await parseLayers(valus, canvasEditor);
    });
  },
};

const insertTypeHand = (type) => {
  const cb = HANDLEMAP[type];
  cb && typeof cb === "function" && cb();
};

const insert = () => {
  canvasEditor.insert();
};
</script>

<style scoped lang="scss">
:deep(.ivu-select-dropdown) {
  z-index: 999;
}
</style>
