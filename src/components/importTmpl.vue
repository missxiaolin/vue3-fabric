<template>
  <div>
    <div class="search-box"></div>
    <div>
      <Tooltip
        :content="info.label"
        v-for="(info, i) in materialist"
        :key="`${i}-bai1-button`"
        placement="top"
      >
        <img
          class="tmpl-img"
          :alt="info.label"
          v-lazy="info.src"
          @click="beforeClearTip(i)"
        />
      </Tooltip>
    </div>
  </div>
</template>

<script setup name="importTmpl">
import { ref } from 'vue'
import useSelect from '@/hooks/select';
import { Spin, Modal } from 'view-ui-plus';
import arr from "@/mock/temp"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { canvasEditor } = useSelect();
const materialist = ref(arr)
const beforeClearTip = (index) => {
    Modal.confirm({
    title: t('tip'),
    content: `<p>${t('replaceTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => insertSvgFile(materialist.value[index].temp),
  });
}

// 插入文件
const insertSvgFile = (jsonFile) => {
  canvasEditor.insertSvgFile(JSON.stringify(jsonFile));
};


</script>

<style scoped lang="scss">
.search-box {
  padding-top: 10px;
  display: flex;
  .input {
    margin-left: 10px;
  }
}
.tmpl-img {
  width: 132px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
