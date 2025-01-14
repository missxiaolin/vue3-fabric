// 拖拽插件

declare type ExtCanvas = fabric.Canvas & {
  isDragging: boolean;
  lastPosX: number;
  lastPosY: number;
};

class DringPlugin {
  public canvas: any;
  public editor: any;
  public defautOption = {};
  static pluginName = "DringPlugin";
  static events = ["startDring", "endDring"];
  static apis = ["startDring", "endDring"];
  public hotkeys: string[] = ["space"];
  dragMode = false;
  constructor(canvas: fabric.Canvas, editor: any) {
    this.canvas = canvas;
    this.editor = editor;
    this.dragMode = false;
    this.init();
  }
  init() {
    this._initDring();
  }

  startDring() {
    this.dragMode = true;
    this.canvas.defaultCursor = "grab";
    this.editor.emit("startDring");
    this.canvas.renderAll();
  }
  endDring() {
    this.dragMode = false;
    this.canvas.defaultCursor = "default";
    this.canvas.isDragging = false;
    this.editor.emit("endDring");
    this.canvas.renderAll();
  }

  // 拖拽模式;
  _initDring() {
    const This = this;
    this.canvas.on("mouse:down", function (this: ExtCanvas, opt: any) {
      const evt = opt.e;
      if (evt.altKey || This.dragMode) {
        This.canvas.defaultCursor = "grabbing";
        This.canvas.discardActiveObject();
        This._setDring();
        this.selection = false;
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        this.requestRenderAll();
      }
    });

    this.canvas.on("mouse:move", function (this: ExtCanvas, opt: any) {
      if (this.isDragging) {
        This.canvas.discardActiveObject();
        This.canvas.defaultCursor = "grabbing";
        const { e } = opt;
        if (!this.viewportTransform) return;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        this.requestRenderAll();
      }
    });

    this.canvas.on("mouse:up", function (this: ExtCanvas) {
      if (!this.viewportTransform) return;
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
      this.getObjects().forEach((obj: any) => {
        if (obj.id !== "workspace" && obj.hasControls) {
          obj.selectable = true;
        }
      });
      This.canvas.defaultCursor = "default";
      this.requestRenderAll();
    });
  }

  _setDring() {
    this.canvas.selection = false;
    this.canvas.defaultCursor = "grab";
    this.canvas.getObjects().forEach((obj: any) => {
      obj.selectable = false;
    });
    this.canvas.requestRenderAll();
  }

  destroy() {
    console.log("pluginDestroy");
  }

  // 快捷键扩展回调
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // @ts-ignore
  hotkeyEvent(eventName: string, e: any) {
    if (e.code === "Space" && e.type === "keydown") {
      if (!this.dragMode) {
        this.startDring();
      }
    }
    if (e.code === "Space" && e.type === "keyup") {
      this.endDring();
    }
  }
}

export default DringPlugin;
