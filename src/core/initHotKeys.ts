import vfe from "vfe";
import hotkeys from "hotkeys-js";

const keyNames = {
  lrdu: "left,right,down,up", // 左右上下
  backspace: "backspace", // backspace键盘
  ctrlz: "ctrl+z",
  ctrlc: "ctrl+c",
  ctrlv: "ctrl+v",
};

/**
 * @param canvas 
 * @param editor 
 */
function initHotkeys(canvas: fabric.Canvas, editor: vfe.ICanvas) {
    
}

export default initHotkeys;
export { keyNames, hotkeys };
