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
import { base64ToBlob } from "@/utils/utils";

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

const codeChange = (v) => {
  if (v == "") {
    canvasEditor.del()
    return;
  }
};

onMounted(() => {
  event.on("selectOne", init);
});

onBeforeUnmount(() => {
  event.off("selectOne", init);
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
