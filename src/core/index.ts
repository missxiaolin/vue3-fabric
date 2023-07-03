import { EventEmitter } from "events";
import type EditorWorkspace from "./EditorWorkspace";

class Editor extends EventEmitter {
  canvas: fabric.Canvas;
  editorWorkspace: EditorWorkspace | null;
  constructor(canvas: fabric.Canvas) {
    super();
    this.canvas = canvas;
    this.editorWorkspace = null;
  }
}

export default Editor;
