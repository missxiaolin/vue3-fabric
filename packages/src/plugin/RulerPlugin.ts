// 标尺插件

import { fabric } from "fabric";
import Editor from "../Editor";
// import { throttle } from 'lodash-es';
type IEditor = Editor;

import initRuler from "../ruler";

class RulerPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = "RulerPlugin";
  // static events = ['sizeChange'];
  static apis = [
    "hideGuideline",
    "showGuideline",
    "rulerEnable",
    "rulerDisable",
  ];
  ruler: any;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.init();
  }

  hookSaveBefore() {
    return new Promise((resolve) => {
      this.hideGuideline();
      resolve(true);
    });
  }

  hookSaveAfter() {
    return new Promise((resolve) => {
      this.showGuideline();
      resolve(true);
    });
  }

  init() {
    this.ruler = initRuler(this.canvas);
  }

  hideGuideline() {
    this.ruler.hideGuideline();
  }

  showGuideline() {
    this.ruler.showGuideline();
  }

  rulerEnable() {
    this.ruler.enable();
  }

  rulerDisable() {
    this.ruler.disable();
  }

  destroy() {
    console.log("pluginDestroy");
  }
}

export default RulerPlugin;
