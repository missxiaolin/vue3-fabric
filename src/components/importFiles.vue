<template>
  <div style="display: inline-block">
    <Dropdown transfer-class-name="fix" @on-click="insertTypeHand">
      <a href="javascript:void(0)">
        {{ $t("import_files.name") }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <template #list>
        <DropdownMenu>
          <!-- 文件 -->
          <DropdownItem name="insertPsd">{{
            $t("import_files.import_psd")
          }}</DropdownItem>
          <!-- JSON -->
          <DropdownItem name="insertJson">{{
            $t("import_files.import_json")
          }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </div>
</template>

<script name="ImportFiles" setup>
import useSelect from "@/hooks/select";
import { parseLayers } from "@/utils/utils";
const { canvasEditor } = useSelect();

const HANDLEMAP = {
  // 导入json
  insertJson: function () {
    insert();
  },
  // 导入psd文件
  insertPsd: function () {
    canvasEditor.insertPsd(async (valus) => {
      await parseLayers(valus, canvasEditor);
    });
  },
};

const insertTypeHand = (type) => {
  const cb = HANDLEMAP[type];
  cb && typeof cb === "function" && cb();
};

const insert = () => {
  canvasEditor.insert();
};
</script>

<style scoped lang="scss">
:deep(.ivu-select-dropdown) {
  z-index: 999;
}
</style>
