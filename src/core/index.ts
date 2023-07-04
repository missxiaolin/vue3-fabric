import { EventEmitter } from "events";
import type EditorWorkspace from "./EditorWorkspace";

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
}

export default Editor;
