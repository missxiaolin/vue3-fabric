<template>
  <div v-if="!mixinState.mSelectMode">
    <Divider plain orientation="left">{{ $t("size") }}{{ mixinState.mSelectMode }}</Divider>
    <Form :label-width="40">
      <FormItem :label="$t('width')" prop="name">
        <!-- :max="2000" -->
        <InputNumber
          :min="1"
          v-model="width"
          @on-change="setSize"
        ></InputNumber>
      </FormItem>
      <FormItem :label="$t('height')" prop="name">
        <!-- :max="2000" -->
        <InputNumber
          :min="1"
          v-model="height"
          @on-change="setSize"
        ></InputNumber>
      </FormItem>
    </Form>
    <!-- <Divider plain orientation="left">{{ $t("default_size") }}</Divider>
    <ButtonGroup vertical>
      <Button
        v-for="(item, i) in presetSize"
        :key="`${i}presetSize`"
        size="small"
        style="text-align: left"
        @click="setSizeBy(item.width, item.height)"
      >
        {{ item.label }}:{{ item.width }}x{{ item.height }}
      </Button>
    </ButtonGroup> -->
  </div>
</template>

<script setup name="CanvasSize">
import { Modal } from 'view-ui-plus';
import { ref, onMounted, reactive } from "vue";
import useSelect from "@/hooks/select";
import { useI18n } from "vue-i18n";

const { canvas, mixinState, canvasEditor } = useSelect();
const { t } = useI18n();

let width = ref(900);
let height = ref(1200);

let presetSize = reactive([
  {
    label: t("red_book_vertical"),
    width: 900,
    height: 1200,
  },
  {
    label: t("red_book_horizontal"),
    width: 1200,
    height: 900,
  },
  {
    label: t("phone_wallpaper"),
    width: 1080,
    height: 1920,
  },
]);

onMounted(() => {
  canvasEditor.setSize(width.value, height.value);
  canvasEditor.on('sizeChange', (width, height) => {
    width.value = width;
    height.value = height;
  });
});

const setSizeBy = (w, h) => {
  width.value = w;
  height.value = h;
  setSize();
};
const setSize = () => {
  canvasEditor.setSize(width.value, height.value);
};
</script>
