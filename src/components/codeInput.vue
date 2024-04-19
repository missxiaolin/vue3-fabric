<template>
  <div
    v-if="
      mixinState.mSelectMode === 'one' &&
      type === 'image' &&
      ['barcode', 'qrcode'].indexOf(name) !== -1
    "
    class="box attr-item"
  >
    <span class="label">{{ $t("codeType.rule") }}：</span>
    <Input v-model="value" clearable @on-change="codeChange(value)" />
  </div>
</template>

<script setup name="codeInput">
import {
  onMounted,
  onBeforeUnmount,
  inject,
  getCurrentInstance,
  ref,
} from "vue";
import useSelect from "@/hooks/select";
import Quagga from "quagga";
import { base64ToBlob, getQrCodeUrl, insertImgFile } from "@/utils/utils";
import JsBarcode from "jsbarcode";

const event = inject("event");
const { mixinState, canvasEditor } = useSelect();
const update = getCurrentInstance();
const type = ref("");
const name = ref("");
const value = ref("");

const init = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    type.value = activeObject.type;
    name.value = activeObject.name;
    value.value = activeObject.codeValue;
    update?.proxy?.$forceUpdate();
  }
};

// 替换图片
const repleace = async (imgUrl, str) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject.codeValue = str
  if (activeObject && activeObject.type === "image") {
    // 字符串转El
    const imgEl = await insertImgFile(imgUrl);
    const width = activeObject.get("width");
    const height = activeObject.get("height");
    const scaleX = activeObject.get("scaleX");
    const scaleY = activeObject.get("scaleY");
    activeObject.setSrc(imgEl.src, () => {
      activeObject.set("scaleX", (width * scaleX) / imgEl.width);
      activeObject.set("scaleY", (height * scaleY) / imgEl.height);
      canvasEditor.canvas.renderAll();
    });
    imgEl.remove();
  }
};

const codeChange = async (v) => {
  if (v == "") {
    canvasEditor.del();
    return;
  }
  switch (name.value) {
    case "qrcode":
      let imgUrl = await getQrCodeUrl(v);
      repleace(imgUrl, v);
      break;
    case "barcode":
      let str = "123456789";
      // 创建一个空的图片元素用于渲染条形码
      const imgEl = document.createElement("img");
      // 调用 JsBarcode 库的方法生成条形码
      JsBarcode(imgEl, v);

      // 将条形码图片 URL 赋值给图片元素的 src 属性
      const barcodeImageUrl = imgEl.src;
      repleace(barcodeImageUrl, v);
      break;
    default:
  }
};

onMounted(() => {
  canvasEditor.on('selectOne', init);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', init);
});
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: row;
  span {
    white-space: nowrap;
  }
}
</style>
