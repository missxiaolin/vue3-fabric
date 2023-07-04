// @ts-nocheck # 忽略全文

import { v4 as uuid } from "uuid";
import { fabric } from "fabric";
import Arrow from "@/core/objects/Arrow";

/**
 * 线条绘制
 * @param canvas
 * @param defaultPosition
 */
function initializeLineDrawing(canvas: any, defaultPosition: any) {
  let isDrawingLine: any = false;
  let isDrawingLineMode: any = false;
  let isArrow: any = false;
  let lineToDraw: any;
  let pointer: any;
  let pointerPoints: any;

  canvas.on("mouse:down", (o: any) => {
    if (!isDrawingLineMode) return;
    canvas.discardActiveObject();
    canvas.getObjects().forEach((obj: any) => {
      obj.selectable = false;
      obj.hasControls = false;
    });
    canvas.requestRenderAll();
    isDrawingLine = true;
    pointer = canvas.getPointer(o.e);
    pointerPoints = [pointer.x, pointer.y, pointer.x, pointer.y];

    const NodeHandler = isArrow ? Arrow : fabric.Line;
    lineToDraw = new NodeHandler(pointerPoints, {
      strokeWidth: 2,
      stroke: "#000000",
      ...defaultPosition,
      id: uuid(),
    });

    lineToDraw.selectable = false;
    lineToDraw.evented = false;
    lineToDraw.strokeUniform = true;
    canvas.add(lineToDraw);
  });

  canvas.on("mouse:move", (o: any) => {
    if (!isDrawingLine) return;
    canvas.discardActiveObject();
    const activeObject = canvas.getActiveObject();
    if (activeObject) return;
    pointer = canvas.getPointer(o.e);

    if (o.e.shiftKey) {
      // calc angle
      const startX = pointerPoints[0];
      const startY = pointerPoints[1];
      const x2 = pointer.x - startX;
      const y2 = pointer.y - startY;
      const r = Math.sqrt(x2 * x2 + y2 * y2);
      let angle: any = (Math.atan2(y2, x2) / Math.PI) * 180;
      angle = parseInt(((angle + 7.5) % 360) / 15) * 15;

      const cosx = r * Math.cos((angle * Math.PI) / 180);
      const sinx = r * Math.sin((angle * Math.PI) / 180);

      lineToDraw.set({
        x2: cosx + startX,
        y2: sinx + startY,
      });
    } else {
      lineToDraw.set({
        x2: pointer.x,
        y2: pointer.y,
      });
    }

    canvas.renderAll();
  });

  canvas.on("mouse:up", () => {
    if (!isDrawingLine) return;
    lineToDraw.setCoords();
    isDrawingLine = false;
    canvas.discardActiveObject();
  });

  function endRest() {
    canvas.getObjects().forEach((obj: any) => {
      if (obj.id !== "workspace") {
        obj.selectable = true;
        obj.hasControls = true;
      }
    });
  }

  return {
    setArrow(params: any) {
      isArrow = params;
    },
    setMode(params: any) {
      isDrawingLineMode = params;
      if (!isDrawingLineMode) {
        endRest();
      }
    },
  };
}

export default initializeLineDrawing;
