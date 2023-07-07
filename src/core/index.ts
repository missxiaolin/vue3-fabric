import { EventEmitter } from "events";
import type EditorWorkspace from "./EditorWorkspace";
import { v4 as uuid } from "uuid";

import initControls from "./initControls";
import InitCenterAlign from "./initCenterAlign";
import initHotkeys from "./initHotKeys";
import initRuler from "./ruler";
import type CanvasRuler from "./ruler/ruler";

/**
 * 主逻辑程序代码
 */
class Editor extends EventEmitter {
  canvas: fabric.Canvas;
  editorWorkspace: EditorWorkspace | null;
  centerAlign: InitCenterAlign;
  ruler: CanvasRuler;
  constructor(canvas: fabric.Canvas) {
    super();
    this.canvas = canvas;
    this.editorWorkspace = null;

    // initHotkeys(canvas, this);
    // 初始化canvas
    initControls(canvas);
    this.centerAlign = new InitCenterAlign(canvas);
    this.ruler = initRuler(canvas);
  }

  // 多选对象复制
  _copyActiveSelection(activeObject: fabric.Object) {
    // 间距设置
    const grid = 10;
    const canvas = this.canvas;
    activeObject?.clone((cloned: fabric.Object) => {
      // 再次进行克隆，处理选择多个对象的情况
      cloned.clone((clonedObj: fabric.ActiveSelection) => {
        canvas.discardActiveObject();
        if (clonedObj.left === undefined || clonedObj.top === undefined) return;
        // 将克隆的画布重新赋值
        clonedObj.canvas = canvas;
        // 设置位置信息
        clonedObj.set({
          left: clonedObj.left + grid,
          top: clonedObj.top + grid,
          evented: true,
          id: uuid(),
        });
        clonedObj.forEachObject((obj: fabric.Object) => {
          obj.id = uuid();
          canvas.add(obj);
        });
        // 解决不可选择问题
        clonedObj.setCoords();
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    });
  }

  /**
   * 单个对象复制
   * @param activeObject
   */
  _copyObject(activeObject: fabric.Object) {
    // 间距设置
    const grid = 10;
    const canvas = this.canvas;
    activeObject?.clone((cloned: fabric.Object) => {
      if (cloned.left === undefined || cloned.top === undefined) return;
      canvas.discardActiveObject();
      // 设置位置信息
      cloned.set({
        left: cloned.left + grid,
        top: cloned.top + grid,
        evented: true,
        id: uuid(),
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  }

  _workspaceSendToBack() {
    const workspace = this.getWorkspace();
    workspace && workspace.sendToBack();
  }

  getWorkspace() {
    return this.canvas.getObjects().find((item) => item.id === "workspace");
  }

  /**
   * 复制
   * @param paramsActiveObeject
   * @returns
   */
  clone(paramsActiveObeject: fabric.ActiveSelection | fabric.Object) {
    const activeObject = paramsActiveObeject || this.canvas.getActiveObject();
    if (!activeObject) return;
    this._copyObject(activeObject);
  }

  up() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringForward();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  upTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringToFront();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  down() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendBackwards();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  downTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendToBack();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  // 导出json
  getJson() {
    return this.canvas.toJSON([
      "id",
      "gradientAngle",
      "selectable",
      "hasControls",
    ]);
  }

  group() {
    // 组合元素
    const activeObj = this.canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeObj) return;
    const activegroup = activeObj.toGroup();
    const objectsInGroup = activegroup.getObjects();
    activegroup.clone((newgroup: fabric.Group) => {
      newgroup.set("id", uuid());
      this.canvas.remove(activegroup);
      objectsInGroup.forEach((object) => {
        this.canvas.remove(object);
      });
      this.canvas.add(newgroup);
      this.canvas.setActiveObject(newgroup);
    });
  }

  // 拆分组
  unGroup() {
    const activeObject = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObject) return;
    // 先获取当前选中的对象，然后打散
    activeObject.toActiveSelection();
    activeObject.getObjects().forEach((item: fabric.Object) => {
      item.set("id", uuid());
    });
    this.canvas.discardActiveObject().renderAll();
  }

  /**
   * @description: 拖拽添加到画布
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(event: DragEvent, item: fabric.Object) {
    const { left, top } = this.canvas
      .getSelectionElement()
      .getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;

    const point = {
      x: event.x - left,
      y: event.y - top,
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }
}

export default Editor;
