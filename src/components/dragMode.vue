<!-- 拖拽模式 -->
<template>
  <div class="box">
    <Switch size="large" v-model="status" @on-change="switchMode">
      <template #open>
        <span>Drag</span>
      </template>
    </Switch>
  </div>
</template>

<script setup ame="Drag">
import { ref, onMounted, onBeforeUnmount } from "vue";
import useSelect from "@/hooks/select";
const status = ref(false);
const { canvas } = useSelect();

const switchMode = (val) => {
  if (val) {
    canvas.editor.editorWorkspace.startDring();
  } else {
    canvas.editor.editorWorkspace.endDring();
  }
};

const handleKeyDown = (e) => {
  if (status.value) return;
  if (e.code === "Space") {
    status.value = true;
    canvas.editor.editorWorkspace.startDring();
  }
};

const handleKeyUp = (e) => {
  if (e.code === "Space") {
    status.value = false;
    canvas.editor.editorWorkspace.endDring();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});
</script>

<style scoped lang="scss">
.box {
  position: absolute;
  right: 193px;
  bottom: 14px;
}
</style>
