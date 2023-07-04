import { EventEmitter } from "events";
import type EditorWorkspace from "./EditorWorkspace";

import initControls from './initControls';

class Editor extends EventEmitter {
  canvas: fabric.Canvas;
  editorWorkspace: EditorWorkspace | null;
  constructor(canvas: fabric.Canvas) {
    super();
    this.canvas = canvas;
    this.editorWorkspace = null;

    // 初始化canvas
    initControls(canvas);
  }
}

export default Editor;
