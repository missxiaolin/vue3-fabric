<template>
  <Tooltip v-if="mixinState.mSelectMode" :content="$t('quick.del')">
    <Button @click="del" icon="ios-trash" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Del">
import useSelect from "@/hooks/select";
import { debounce } from "lodash-es";

const { canvas, mixinState } = useSelect();

// 删除控件2种方案都可以
const del = debounce(function () {
  const activeObject = canvas.c.getActiveObjects();
  if (activeObject) {
    activeObject.map((item) => canvas.c.remove(item));
  }
  canvas.c.requestRenderAll();
  canvas.c.discardActiveObject();

//   const activeObject = canvas.c.getActiveObject();
//   if (activeObject) {
//     canvas.c.remove(activeObject);
//   }
//   canvas.c.renderAll();
}, 300);
</script>
