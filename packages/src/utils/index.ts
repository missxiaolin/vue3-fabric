// file content

import FontFaceObserver from "fontfaceobserver";

/**
 * @description: 根据json模板下载字体文件
 * @param {String} str
 * @return {Promise}
 */
export function downFontByJSON(str: string) {
  const skipFonts = ["arial", "Microsoft YaHei"];
  const fontFamilies: string[] = JSON.parse(str)
    .objects.filter(
      (item: any) =>
        // 为text 并且不为包含字体
        // eslint-disable-next-line implicit-arrow-linebreak
        item.type.includes("text") && !skipFonts.includes(item.fontFamily)
    )
    .map((item: any) => item.fontFamily);
  const fontFamiliesAll = fontFamilies.map((fontName) => {
    const font = new FontFaceObserver(fontName);
    return font.load(null, 150000);
  });
  return Promise.all(fontFamiliesAll);
}
