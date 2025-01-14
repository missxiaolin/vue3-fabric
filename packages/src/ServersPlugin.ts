// 内部插件
import { v4 as uuid } from "uuid";
import { selectFiles, clipboardText, getImgStr, parsePsdFile, checkFileExt } from "./utils/utils";
import { fabric } from "fabric";
import Editor from "./Editor";
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';
import { SelectEvent, SelectMode } from "./eventType";

function downFile(fileStr: string, fileType: string) {
  const anchorEl = document.createElement("a");
  anchorEl.href = fileStr;
  anchorEl.download = `${uuid()}.${fileType}`;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}

function transformText(objects: any) {
  if (!objects) return;
  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === "text" && (item.type = "textbox");
    }
  });
}

class ServersPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  public selectedMode: SelectMode;
  static pluginName = "ServersPlugin";
  static apis = [
    "insert",
    "insertPsd",
    "insertSvgFile",
    "getJson",
    "dragAddItem",
    "clipboard",
    "saveJson",
    "saveSvg",
    "saveImg",
    "clear",
    "preview",
    "getSelectMode",
  ];
  static events = [SelectMode.ONE, SelectMode.MULTI, SelectEvent.CANCEL];
  // public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.selectedMode = SelectMode.EMPTY;
    this._initSelectEvent();
  }

  private _initSelectEvent() {
    this.canvas.on("selection:created", () => this._emitSelectEvent());
    this.canvas.on("selection:updated", () => this._emitSelectEvent());
    this.canvas.on("selection:cleared", () => this._emitSelectEvent());
  }

  private _emitSelectEvent() {
    if (!this.canvas) {
      throw TypeError("还未初始化");
    }

    const actives = this.canvas
      .getActiveObjects()
      .filter((item) => !(item instanceof fabric.GuideLine)); // 过滤掉辅助线
    if (actives && actives.length === 1) {
      this.selectedMode = SelectMode.ONE;
      this.editor.emit(SelectEvent.ONE, actives);
    } else if (actives && actives.length > 1) {
      this.selectedMode = SelectMode.MULTI;
      this.editor.emit(SelectEvent.MULTI, actives);
    } else {
      this.editor.emit(SelectEvent.CANCEL);
    }
  }

  getSelectMode() {
    return String(this.selectedMode);
  }

  insert() {
    selectFiles({ accept: ".json" }).then((files) => {
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
          this.insertSvgFile(reader.result as string);
        };
      }
    });
  }

  /**
   * psd 解析
   * @param cb 
   */
  async insertPsd(cb: any) {
    selectFiles({ accept: ".psd", multiple: false }).then((fileList: any) => {
      // @ts-ignore
      let oldAll: any = [];
      for (const item of Array.from(fileList)) {
        if (checkFileExt(item, ["psd"])) {
          console.log("开始执行");
          // @ts-ignore
          const onProcess = (result: any) => {};
          // PSD文件
          // @ts-ignore
          parsePsdFile(item, onProcess)
            .then(async (value: any) => {
              cb && typeof cb === 'function' && cb(value);
              // const { psd, layers } = value;
              // console.log(psd)
              // console.log("layers=", layers);
            })
            .catch((reason: any) => {
              console.log('error', reason.message)
            });
        } else {
          // 非PSD文件
          // @ts-ignore
          getImgStr(item).then((file: any) => {
            // insertImgFile(file)
          });
        }
      }
    });
  }

  insertSvgFile(jsonFile: string, callback?: () => void) {
    // 加载前钩子
    this.editor.hooksEntity.hookImportBefore.callAsync(jsonFile, () => {
      this.canvas.loadFromJSON(jsonFile, () => {
        this.canvas.renderAll();
        // 加载后钩子
        this.editor.hooksEntity.hookImportAfter.callAsync(jsonFile, () => {
          this.canvas.renderAll();
          // this.editor.getPlugin('HistoryPlugin').history.clear();
          callback && callback();
        });
      });
    });
  }

  getJson() {
    return this.canvas.toJSON([
      "id",
      "gradientAngle",
      "selectable",
      "hasControls",
      "linkData",
    ]);
  }

  /**
   * @description: 拖拽添加到画布
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(item: fabric.Object, event?: DragEvent) {
    if (event) {
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
    }
    const { width } = this._getSaveOption();
    width && item.scaleToWidth(width / 2);
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }

  clipboard() {
    const jsonStr = this.getJson();
    clipboardText(JSON.stringify(jsonStr, null, "\t"));
  }

  async saveJson() {
    const dataUrl = this.getJson();
    // 把文本text转为textgroup，让导入可以编辑
    await transformText(dataUrl.objects);
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t")
    )}`;
    downFile(fileStr, "json");
  }

  saveSvg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync("", () => {
      const option: any = this._getSaveSvgOption();
      const dataUrl = this.canvas.toSVG(option);
      const fileStr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        dataUrl
      )}`;
      this.editor.hooksEntity.hookSaveAfter.callAsync(fileStr, () => {
        downFile(fileStr, "svg");
      });
    });
  }

  saveImg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync("", () => {
      const option = this._getSaveOption();
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = this.canvas.toDataURL(option);
      this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
        downFile(dataUrl, "png");
      });
    });
  }

  preview() {
    return new Promise((resolve) => {
      this.editor.hooksEntity.hookSaveBefore.callAsync("", () => {
        const option = this._getSaveOption();
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.canvas.renderAll();
        const dataUrl = this.canvas.toDataURL(option);
        this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
          resolve(dataUrl);
        });
      });
    });
  }

  _getSaveSvgOption() {
    const workspace = this.canvas
      .getObjects()
      .find((item: any) => item.id === "workspace");
    const { left, top, width, height } = workspace as fabric.Object;
    return {
      width,
      height,
      viewBox: {
        x: left,
        y: top,
        width,
        height,
      },
    };
  }

  _getSaveOption() {
    const workspace = this.canvas
      .getObjects()
      .find((item: any) => item.id === "workspace");
    const { left, top, width, height } = workspace as fabric.Object;
    const option = {
      name: "New Image",
      format: "png",
      quality: 1,
      width,
      height,
      left,
      top,
    };
    return option;
  }

  clear() {
    this.canvas.getObjects().forEach((obj: any) => {
      if (obj.id !== "workspace") {
        this.canvas.remove(obj);
      }
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  destroy() {
    console.log("pluginDestroy");
  }
}

export default ServersPlugin;
