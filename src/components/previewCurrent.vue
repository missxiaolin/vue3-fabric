<template>
  <div class="preview-box">
    <Button type="text" @click="preview">
      {{ $t("preview") }}
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { ImagePreview } from 'view-ui-plus';
import vfe from 'vfe';

const canvasEditor = inject('canvasEditor') as vfe.ICanvas;
const preview = () => {
  canvasEditor.preview().then((dataUrl) => {
    // const dataUrl = getImgUrl();
    ImagePreview.show({
      previewList: [dataUrl],
    });
  });
};
</script>

<style scoped lang="scss">
.preview-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
