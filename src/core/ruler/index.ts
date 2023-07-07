// @ts-nocheck # 忽略全文
import { fabric } from "fabric";
import CanvasRuler, { RulerOptions } from "./ruler";

function initRuler(canvas: Canvas, options?: RulerOptions) {
  const ruler = new CanvasRuler({
    canvas,
    ...options,
  });

  /**
   * 获取workspace
   */
  const getWorkspace = () => {
    workspace = canvas.getObjects().find((item) => item.id === 'workspace');
  };

  return ruler;
}

export default initRuler;
