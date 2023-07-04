<template>
    <div v-if="mixinState.mSelectMode === 'multiple'" class="box attr-item">
        <!-- 水平对齐 -->
        
    </div>
</template>

<script setup name="Align">
import useSelect from '@/hooks/select';

const { canvas, mixinState } = useSelect();


</script>

<style scoped lang="scss">
.box {
  display: flex;
  align-items: center;
  .ivu-tooltip {
    text-align: center;
    flex: 1;
  }
}
:deep(.ivu-btn) {
  &[disabled] {
    svg {
      opacity: 0.2;
    }
  }
}
</style>