import { inject, onBeforeMount, onMounted, reactive } from "vue";

import Editor, { EventType } from "xiaolin-core-fabric";
const { SelectEvent, SelectMode } = EventType;

interface Selector {
  // @ts-ignore
  mSelectMode: SelectMode;
  mSelectOneType: string | undefined;
  mSelectId: string | undefined;
  mSelectIds: (string | undefined)[];
  mSelectActive: unknown[];
}

export default function useSelect() {
  const state = reactive<Selector>({
    mSelectMode: SelectMode.EMPTY,
    mSelectOneType: "",
    mSelectId: "", // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: [],
  });

  const fabric = inject("fabric");
  const canvasEditor = inject("canvasEditor") as Editor;

  const selectOne = (e: [fabric.Object]) => {
    state.mSelectMode = SelectMode.ONE;
    if (e[0]) {
      state.mSelectId = e[0].id;
      state.mSelectOneType = e[0].type;
      state.mSelectIds = e.map((item) => item.id);
    }
  };

  const selectMulti = (e: fabric.Object[]) => {
    state.mSelectMode = SelectMode.MULTI;
    state.mSelectId = "";
    state.mSelectIds = e.map((item) => item.id);
  };

  const selectCancel = () => {
    state.mSelectId = "";
    state.mSelectIds = [];
    state.mSelectMode = SelectMode.EMPTY;
    state.mSelectOneType = "";
  };

  onMounted(() => {
    canvasEditor.on(SelectEvent.ONE, selectOne);
    canvasEditor.on(SelectEvent.MULTI, selectMulti);
    canvasEditor.on(SelectEvent.CANCEL, selectCancel);
  });

  onBeforeMount(() => {
    canvasEditor.off(SelectEvent.ONE, selectOne);
    canvasEditor.off(SelectEvent.MULTI, selectMulti);
    canvasEditor.off(SelectEvent.CANCEL, selectCancel);
  });

  return {
    fabric,
    canvasEditor,
    mixinState: state,
  };
}
