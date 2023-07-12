// @ts-nocheck # 忽略全文
import { fabric } from "fabric";
import { v4 as uuid } from "uuid";

/**
 * 主要用于组的图片更换
 */
class EditorGroupImg {
  canvas: fabric.Canvas;
  isDown: boolean;
  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this._init();
    this.isDown = false;
  }

  _init() {
    this.canvas.on("mouse:down", (opt) => {
      this.isDown = true;
      if (opt.target && opt.target.type === "group") {
        const imageObject = this._getGroupImgObj(opt) as fabric.Image;
        if (imageObject) {
          this._bedingEditingEvent(imageObject, opt);
          this.canvas.setActiveObject(imageObject);
        } else {
          this.canvas.setActiveObject(opt.target);
        }
      }
    });

    this.canvas.on("mouse:up", () => {
      this.isDown = false;
    });

    this.canvas.on("mouse:move", (opt) => {
      if (this.isDown && opt.target && opt.target.type === "group") {
        const imageObject = this._getGroupImgObj(opt);
        if (imageObject) {
          // todo bug 图片编辑结束后，点击组内其他元素可单独拖动
        }
      }
    });
  }

  /**
   * 获取点击区域内的组内图片元素
   * @param opt
   * @returns
   */
  _getGroupImgObj(opt: fabric.IEvent<MouseEvent>) {
    if (!opt) {
      return;
    }
    const pointer = this.canvas.getPointer(opt.e, true);
    const clickObj = this.canvas._searchPossibleTargets(
      opt.target?._objects,
      pointer
    );
    if (clickObj && this.isImage(clickObj)) {
      return clickObj;
    }
    return false;
  }

  /**
   * 判断图片元素
   * @param obj
   * @returns
   */
  isImage(obj: fabric.Object) {
    return obj.type && ["image"].includes(obj.type);
  }

  // 绑定编辑取消事件
  _bedingEditingEvent(
    imageObject: fabric.Image,
    opt: fabric.IEvent<MouseEvent>
  ) {
    if (!opt.target) return;
    const left = opt.target.left;
    const top = opt.target.top;
    const ids = this._unGroup() || [];
    const resetGroup = () => {
      const groupArr = this.canvas
        .getObjects()
        .filter((item) => item.id && ids.includes(item.id));
      // 删除元素
      groupArr.forEach((item) => this.canvas.remove(item));

      // 生成新组
      const group = new fabric.Group([...groupArr]);
      group.set("left", left);
      group.set("top", top);
      group.set("id", uuid());
      textObject.off("editing:exited", resetGroup);
      this.canvas.add(group);
      this.canvas.discardActiveObject().renderAll();
    };
    // 绑定取消事件
    imageObject.on("editing:exited", resetGroup);
  }

  // 拆分组合并返回ID
  _unGroup() {
    const ids: string[] = [];
    const activeObj = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObj) return;
    activeObj.getObjects().forEach((item) => {
      const id = uuid();
      ids.push(id);
      item.set("id", id);
    });
    activeObj.toActiveSelection();
    return ids;
  }
}

export default EditorGroupImg;
