import { fabric } from 'fabric';
import { throttle } from 'lodash-es';

declare type EditorWorkspaceOption = { width: number; height: number };
declare type ExtCanvas = fabric.Canvas & {
  isDragging: boolean;
  lastPosX: number;
  lastPosY: number;
};

/**
 * 工作区初始化
 */
class EditorWorkspace {
  canvas: fabric.Canvas;
  workspaceEl: HTMLElement;
  workspace: fabric.Rect | null;
  option: EditorWorkspaceOption;
  // width: number;
  // height: number;
  dragMode: boolean;
  constructor(canvas: fabric.Canvas, option: EditorWorkspaceOption) {
    this.canvas = canvas;
    const workspaceEl = document.querySelector('#workspace') as HTMLElement;
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.workspace = null;
    this.option = option;
    this.dragMode = false;
    this._initBackground();
    this._initWorkspace();
  }

  /**
   * 初始化工作区域宽度高度
   */
  _initBackground() {
    this.canvas.backgroundImage = '';
    this.canvas.setWidth(this.workspaceEl.offsetWidth);
    this.canvas.setHeight(this.workspaceEl.offsetHeight);
  }

  // 初始化画布
  _initWorkspace() {
    const { width, height } = this.option;
    const workspace = new fabric.Rect({
      fill: 'rgba(255,255,255,1)',
      width,
      height,
      id: 'workspace',
    });
    workspace.set('selectable', false); // 当设置为false时，Object无法被选中编辑（无论是以像素点为基础或以组为基础），但是相应的事件仍然会触发。默认值为true。
    workspace.set('hasControls', false); // 当属性为false时，Object的控制器将不会显示，与此同时将无法操作Object。默认值为true。
    workspace.hoverCursor = 'default';
    this.canvas.add(workspace);
    this.canvas.renderAll();

    this.workspace = workspace;
    this.auto();
  }

  // 计算缩放比例
  _getScale() {
    const viewPortWidth = this.workspaceEl.offsetWidth;
    const viewPortHeight = this.workspaceEl.offsetHeight;
    // 按照宽度
    if (viewPortWidth / viewPortHeight < this.option.width / this.option.height) {
      return viewPortWidth / this.option.width;
    } // 按照宽度缩放
    return viewPortHeight / this.option.height;
  }

  // 缩放
  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const { workspaceEl } = this;
    const width = workspaceEl.offsetWidth;
    const height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    const center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat()); // 设置Canvas的变换。参数则属于context.transform的一种表现形式。
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale); // 设置Canvas以指定的点为中心进行缩放。第一个参数即为指定的中心点；第二个参数为缩放级别，小于1即为缩小。
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);
    // 超出画布不展示 (深度复制Object。第一个参数是回调函数，该回调的第一个参数是复制出来的Object；第二个参数是一个数组，装载着你想要添加到输出的所有属性。)
    this.workspace.clone((cloned: fabric.Rect) => {
      this.canvas.clipPath = cloned;
      this.canvas.requestRenderAll();
    });
    if (cb) cb(this.workspace.left, this.workspace.top);
  }

  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  setCenterFromObject(obj: fabric.Rect) {
    const { canvas } = this;
    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  }

  // 自动缩放
  auto() {
    const scale = this._getScale();
    this.setZoomAuto(scale - 0.08);
  }
}

export default EditorWorkspace;
