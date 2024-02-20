import { v4 as uuid } from "uuid";

/**
 * PSD文字属性解析
 */
import { Layer } from "ag-psd";
import { toRGBColorStr } from "@/utils/color";

/**
 * 转换Text元素
 * @param layer 图层信息
 * @param options 额外属性
 */
export function parseText(
  layer: any,
  canvasEditor: any,
  fabric: any,
  options = {}
) {
  // 去除换行符前面的空格
  let textStr = layer.text.text.replace(/([^\S\n]*)\n/g, "\n");
  // 默认属性
  const defaultPosition = { shadow: "", fontFamily: "arial" };
  let obj: any = {
    ...defaultPosition,
    fontSize: textUtil.getFontSize(layer),
    id: uuid(),
    fill: textUtil.getFill(layer),
  };
  if (layer.left || layer.left == 0) {
    obj.left = layer.left;
  }
  if (layer.top || layer.top == 0) {
    obj.top = layer.top;
  }
  if (layer.right || layer.right == 0) {
    obj.right = layer.right;
  }
  if (layer.bottom || layer.bottom == 0) {
    obj.bottom = layer.bottom;
  }

  const text = new fabric.IText(textStr, obj);
  canvasEditor.canvas.add(text);
  canvasEditor.canvas.setActiveObject(text);
}

export const textUtil = {
  getWidth(layer: any) {
    return layer.canvas.width + 25;
  },
  getHeight(layer: any) {
    return layer.canvas.height;
  },
  /**
   * 获取文字大小
   * @param layer
   */
  getFontSize: (layer: any) => {
    if (layer.text) {
      return Number(layer.text.style?.fontSize);
    } else {
      // 默认大小
      return 10;
    }
  },
  /**
   * 获取文字字体
   * @param layer
   */
  getFontFamily: (layer: Layer) => {
    let fontFamily = layer.text?.style?.font?.name;
    // TODO 本地字体不存在时，加载网络字体文件
    return fontFamily;
  },
  /**
   * 获取填充颜色
   * @param layer
   */
  getFill: (layer: Layer) => {
    if (
      (layer.text?.style?.fillFlag ||
        layer.text?.style?.fillFlag === undefined) &&
      layer.text?.style?.fillColor
    ) {
      return toRGBColorStr(layer.text?.style?.fillColor);
    } else {
      // 默认黑色
      return "rgb(0,0,0)";
    }
  },
  /**
   * 获取描边
   * @param layer
   */
  getStroke: (layer: Layer) => {
    if (layer.text?.style?.fillFlag) {
      return toRGBColorStr(layer.text?.style?.fillColor);
    }
  },
  /**
   * 获取文字间距
   * @param layer
   */
  getLetterSpacing: (style: any) => {
    /**
     * 在PSD文件中，Tracking（字间距）的单位是千分之一（em）。如果你想将Tracking的单位转换为像素（px），可以使用以下公式：
     * 像素 = 字号大小（pt） * Tracking值 * 0.001
     * 其中，字号大小是以磅（pt）为单位的。通过使用这个公式，你可以将Tracking的单位从千分之一（em）转换为像素（px）值。
     */
    // return style.FontSize * style.Tracking * 0.001
    // let pxUnit =  style.FontSize * style.Tracking * 0.001
    // let px = convert(style.FontSize).from('pt').to('px').valueOf();
    // let px = style.FontSize * (96 / 72)
    // return px * style.Tracking / 1000
    // return style.Tracking * 0.01
    if (style.tracking) {
      return style.tracking * 0.01;
    } else {
      return 0;
    }
    // return px;
  },
};

/**
 * 设置文本 style(样式) 属性
 * @param style
 * @param text
 */
const setTxtStyle = (style: any, text: any) => {
  // 设置文字样式
  // 文字间距
  text.letterSpacing = {
    type: "px",
    // value: psdText2.getLetterSpacing(styleData) / 26 // TODO 搞不懂为什么要除26才正常，或许除26后也不是正常的
    value: textUtil.getLetterSpacing(style),
  };
  console.log("letterSpacing=", text.letterSpacing);
  if (style.strikethrough) {
    // 删除线
    text.textDecoration = "delete";
  }
  if (style.underline) {
    // 下划线
    text.textDecoration = "under";
  }

  // text.referencePoint = style.referencePoint
  if (style.leading) {
    text.lineHeight = {
      type: "px",
      value: style.leading,
    };
  }
  // TODO 处理水平缩放 props.text.style.horizontalScale
};

/**
 * 设置文本段落 paragraphStyle(样式) 属性
 * @param paragraphStyle
 * @param text
 */
const setTxtParagraphStyle = (paragraphStyle: any, text: any) => {
  if (paragraphStyle) {
    text.textAlign = paragraphStyle.justification;
    // 默认都是垂直居中对齐
    text.verticalAlign = "middle";
    text.paraIndent = paragraphStyle.firstLineIndent;
    // text.padding = paragraphStyle.wordSpacing
  }
};

/**
 * 设置文本 effects(效果) 属性
 * @param effects
 * @param text
 */
const setTextEff = (effects: any, text: any) => {
  // 下面开始设置文字效果
  if (effects) {
    // 描边
    if (effects.stroke && effects.stroke.length > 0) {
      let strokeArr: any[] = [];
      effects.stroke.map((stroke: any) => {
        if (stroke.enabled) {
          let type;
          switch (stroke.fillType) {
            case "color":
              type = "solid";
              break;
            default:
              type = "solid";
              break;
          }
          strokeArr.push({
            type: type,
            strokeAlign: stroke.position,
            opacity: stroke.opacity,
            color: toRGBColorStr(stroke.color),
          });
        }
      });
      text.stroke = strokeArr;
    }
  }
};
