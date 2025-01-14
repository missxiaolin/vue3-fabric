// 组合拆分组合插件

import { fabric } from "fabric";
import Editor from "../Editor";
import { v4 as uuid } from "uuid";
type IEditor = Editor;

class GroupPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = "GroupPlugin";
  static apis = ["unGroup", "group"];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  // 拆分组
  unGroup() {
    const activeObject = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObject) return;
    // 先获取当前选中的对象，然后打散
    const activeObjectList = activeObject.getObjects();
    activeObject.toActiveSelection();
    for (const item of activeObjectList) {
      // @ts-ignore
      item.set("id", uuid());
    }
    this.canvas.discardActiveObject().renderAll();
  }

  group() {
    // 组合元素
    const activeObj = this.canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeObj) return;
    const activegroup = activeObj.toGroup();
    const objectsInGroup = activegroup.getObjects();
    activegroup.clone((newgroup: any) => {
      newgroup.set("id", uuid());
      this.canvas.remove(activegroup);
      objectsInGroup.forEach((object) => {
        this.canvas.remove(object);
      });
      this.canvas.add(newgroup);
      this.canvas.setActiveObject(newgroup);
    });
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === "group") {
      return [
        {
          text: "拆分组合",
          hotkey: "Ctrl+V",
          disabled: false,
          onclick: () => this.unGroup(),
        },
      ];
    }

    if (this.canvas.getActiveObjects().length > 1) {
      return [
        {
          text: "组合",
          hotkey: "Ctrl+V",
          disabled: false,
          onclick: () => this.group(),
        },
      ];
    }
  }
  destroy() {
    console.log("pluginDestroy");
  }
}

export default GroupPlugin;
