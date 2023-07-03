<template>
    <div>
        设置
    </div>
</template>

<script setup name="CanvasSize">
import { ref, onMounted } from 'vue'
import useSelect from '@/hooks/select';
import EditorWorkspace from '../core/EditorWorkspace';
const { canvas } = useSelect();

let width = ref(900);
let height = ref(1200);

onMounted(() => {
  canvas.editor.editorWorkspace = new EditorWorkspace(canvas.c, {
    width: width.value,
    height: height.value,
  });
});
</script>