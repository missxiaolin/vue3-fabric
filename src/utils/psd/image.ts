import { v4 as uuid } from "uuid";

/**
 * 转换Image元素
 * @param layer 图层信息
 * @param options 额外属性
 */
export function parseImage(
  layer: any,
  canvasEditor: any,
  fabric: any,
  options = {}
) {
  if (layer.canvas) {
    const url = layer.canvas.toDataURL("image/png");
    const imgEl = document.createElement("img");
    imgEl.src = url;
    // 插入页面
    document.body.appendChild(imgEl);
    imgEl.onload = () => {
      let obj: any = {
        id: uuid(),
        name: layer.name,
        zIndex: layer.zIndex
      }
      if (layer.left || layer.left == 0) {
          obj.left = layer.left
      }
      if (layer.top || layer.top == 0) {
          obj.top = layer.top
      }
      if (layer.right || layer.right == 0) {
          obj.right = layer.right
      }
      if (layer.bottom || layer.bottom == 0) {
          obj.bottom = layer.bottom
      }
      // 创建图片对象
      const imgInstance = new fabric.Image(imgEl, obj);
      imgInstance.scaleToWidth(layer.canvas.width)
      imgInstance.scaleToHeight(layer.canvas.height)
      canvasEditor.canvas.add(imgInstance);
      canvasEditor.canvas.setActiveObject(imgInstance);
      canvasEditor.canvas.renderAll();
      // 删除页面中的图片元素
      imgEl.remove();
    }
    
  }
}
