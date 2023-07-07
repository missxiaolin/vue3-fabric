// @ts-nocheck # 忽略全文
import { fabric } from "fabric";

/**
 * 配置
 */
export interface RulerOptions {
  /**
   * Canvas
   */
  canvas: Canvas;

  /**
   * 标尺宽高
   * @default 20
   */
  ruleSize?: number;

  /**
   * 字体大小
   * @default 10
   */
  fontSize?: number;

  /**
   * 是否开启标尺
   * @default false
   */
  enabled?: boolean;

  /**
   * 背景颜色
   */
  backgroundColor?: string;

  /**
   * 文字颜色
   */
  textColor?: string;

  /**
   * 边框颜色
   */
  borderColor?: string;

  /**
   * 高亮颜色
   */
  highlightColor?: string;
}

export type Rect = { left: number; top: number; width: number; height: number };

export type HighlightRect = {
  skip?: "x" | "y";
} & Rect;

class CanvasRuler {
  protected ctx: CanvasRenderingContext2D;
  /**
   * 配置
   */
  public options: Required<RulerOptions>;

  constructor(_options: RulerOptions) {
    console.log('ceshi555')
    // 合并默认配置
    this.options = Object.assign(
      {
        ruleSize: 20,
        fontSize: 10,
        enabled: false,
        backgroundColor: "#fff",
        borderColor: "#ddd",
        highlightColor: "#007fff",
        textColor: "#888",
      },
      _options
    );

    this.ctx = this.options.canvas.getContext();

    fabric.util.object.extend(this.options.canvas, {
      ruler: this,
    });

    if (this.options.enabled) {
      this.enable();
    }
  }

  public enable() {
    console.log('测试')
  }

  public disable() {

  }
}

export default CanvasRuler;
