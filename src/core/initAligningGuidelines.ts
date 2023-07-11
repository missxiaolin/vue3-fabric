/* eslint-disable no-use-before-define */
/* eslint-disable no-multi-assign */
// noinspection NestedAssignmentJS

/**
 * Should objects be aligned by a bounding box?
 * [Bug] Scaled objects sometimes can not be aligned by edges
 * https://github.com/fabricjs/fabric.js/blob/master/lib/aligning_guidelines.js
 */

import { fabric } from "fabric";

declare interface VerticalLine {
  x: number;
  y1: number;
  y2: number;
}

declare interface HorizontalLine {
  x1: number;
  x2: number;
  y: number;
}

function initAligningGuidelines(canvas: fabric.Canvas) {
  
}

export default initAligningGuidelines;
