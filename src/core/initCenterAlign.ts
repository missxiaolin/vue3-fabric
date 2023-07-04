// @ts-nocheck # 忽略全文
import { fabric } from "fabric";

/**
 * 处理居中方式
 */
class initCenterAlign {
  canvas: fabric.Canvas;
  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  /**
   * 水平居中
   * @param workspace
   * @param object
   * @returns
   */
  centerH(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(workspace.getCenterPoint().x, object.getCenterPoint().y)
    );
  }

  /**
   * 水平垂直居中
   * @param workspace
   * @param object
   * @returns
   */
  center(workspace: fabric.Rect, object: fabric.Object) {
    const center = workspace.getCenterPoint();
    return this.canvas._centerObject(object, center);
  }

  /**
   * 垂直居中
   * @param workspace
   * @param object
   * @returns
   */
  centerV(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(object.getCenterPoint().x, workspace.getCenterPoint().y)
    );
  }

  /**
   * @param name
   */
  position(name: "centerH" | "center" | "centerV") {
    const anignType = ["centerH", "center", "centerV"];
    const activeObject = this.canvas.getActiveObject();
    if (anignType.includes(name) && activeObject) {
      const defaultWorkspace = this.canvas
        .getObjects()
        .find((item) => item.id === "workspace");

      if (defaultWorkspace) {
        this[name](defaultWorkspace, activeObject);
      }
      this.canvas.renderAll();
    }
  }
}

export default initCenterAlign;
