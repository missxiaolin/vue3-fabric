import { EventEmitter } from "events";
import { Canvas } from "fabric/fabric-impl";

/**
 * 发布订阅器
 */
class CanvasEventEmitter extends EventEmitter {
  handler: Canvas | undefined;
  mSelectMode = "";

  init(handler: CanvasEventEmitter["handler"]) {
    this.handler = handler;
  }

  /**
   * 暴露单选多选事件
   * @private
   */
  private selected() {
    if (!this.handler) {
      throw TypeError("还未初始化");
    }
  }
}

export default CanvasEventEmitter;
