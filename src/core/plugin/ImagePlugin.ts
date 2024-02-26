// @ts-nocheck # 忽略全文
import { fabric, util } from "fabric";
import Editor from "../core";
type IEditor = Editor;

export function isolateObjectForEdit(context: any) {
  console.log(Object.prototype.hoverCursor)
  const { canvas } = context
  if (!canvas) return
  // context.hoverCursor = FabricObject.prototype.hoverCursor
  // canvas.requestRenderAll();
  const deselect = context.onDeselect
  context.onDeselect = (...args: any) => {
    deselect.call(context, ...args)
    return true
  };
}

export default class ImagePlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static apis = ["isCropping"];
  public hotkeys: string[] = [];

  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  


  destroy() {
    console.log("pluginDestroy");
  }

  /**
   * 裁剪
   * @returns 
   */
  isCropping() {
    const activeObject = this.canvas.getActiveObjects()[0];
    if (!activeObject) {
      return
    }
    this.canvas.defaultCursor = 'move';
    isolateObjectForEdit(activeObject)
    this.lastEventTop = activeObject.top
    this.lastEventLeft = activeObject.left;
    this.setupDragMatrix();
    activeObject.setCoords()
  }


  setupDragMatrix() {
    
  }
}
