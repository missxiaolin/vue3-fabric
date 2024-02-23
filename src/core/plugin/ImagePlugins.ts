import { fabric } from "fabric";
import Editor from "../core";
type IEditor = Editor;

export class Image {
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

  isCropping() {
    
  }
}
