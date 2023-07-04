import { EventEmitter } from "events";
import type EditorWorkspace from "./EditorWorkspace";
import { v4 as uuid } from 'uuid';

import initControls from './initControls';
import InitCenterAlign from './initCenterAlign';

/**
 * 主逻辑程序代码
 */
class Editor extends EventEmitter {
  canvas: fabric.Canvas;
  editorWorkspace: EditorWorkspace | null;
  centerAlign: InitCenterAlign;
  
  constructor(canvas: fabric.Canvas) {
    super();
    this.canvas = canvas;
    this.editorWorkspace = null;

    // 初始化canvas
    initControls(canvas);
    this.centerAlign = new InitCenterAlign(canvas);
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
}

export default Editor;
