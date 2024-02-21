<template>
  <div
    v-if="
      mixinState.mSelectMode === 'one' &&
      type === 'image' &&
      ['barcode', 'qrcode'].indexOf(name) !== -1
    "
    class="box attr-item"
  >
    <Input v-model="value" placeholder="请输入规则……" clearable />
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

const event = inject("event");
const { mixinState, canvasEditor } = useSelect();
const update = getCurrentInstance();
const type = ref("");
const name = ref("");
const value = ref("");

const init = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  console.log("code input", activeObject);
  if (activeObject) {
    type.value = activeObject.type;
    name.value = activeObject.name;
    update?.proxy?.$forceUpdate();
  }
};

onMounted(() => {
  event.on("selectOne", init);
});

onBeforeUnmount(() => {
  event.off("selectOne", init);
});
</script>

