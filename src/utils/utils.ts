import FontFaceObserver from "fontfaceobserver";
import { useClipboard, useFileDialog, useBase64 } from "@vueuse/core";
import { Message } from "view-ui-plus";
import downloadjs from "downloadjs";
import { Layer, readPsd } from "ag-psd";
import qrcode from "qrcode";

interface Font {
  type: string;
  fontFamily: string;
}

/**
 * @description: 图片文件转字符串
 * @param {Blob|File} file 文件
 * @return {String}
 */
export function getImgStr(file: File | Blob): Promise<FileReader["result"]> {
  return useBase64(file).promise.value;
}

/**
 * @description: 根据json模板下载字体文件
 * @param {String} str
 * @return {Promise}
 */
export function downFontByJSON(str: string) {
  const skipFonts = ["arial", "Microsoft YaHei"];
  const fontFamilies: string[] = JSON.parse(str)
    .objects.filter(
      (item: Font) =>
        // 为text 并且不为包含字体
        // eslint-disable-next-line implicit-arrow-linebreak
        item.type.includes("text") && !skipFonts.includes(item.fontFamily)
    )
    .map((item: Font) => item.fontFamily);
  const fontFamiliesAll = fontFamilies.map((fontName) => {
    const font = new FontFaceObserver(fontName);
    return font.load(null, 150000);
  });
  return Promise.all(fontFamiliesAll);
}

/**
 * @description: 选择文件
 * @param {Object} options accept = '', capture = '', multiple = false
 * @return {Promise}
 */
export function selectFiles(options: {
  accept?: string;
  capture?: string;
  multiple?: boolean;
}): Promise<FileList | null> {
  return new Promise((resolve) => {
    const { onChange, open } = useFileDialog(options);
    onChange((files) => {
      resolve(files);
    });
    open();
  });
}

/**
 * 获取文件后缀
 * @param file 文件
 */
export function getFileExt(file: File | Blob) {
  let fileExtension = "";
  if (file.name.lastIndexOf(".") > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
  }
  return fileExtension;
}

/**
 * 判断文件类型是否在列表内
 * @param file 文件
 * @param fileTypes 文件类型数组
 */
export function checkFileExt(file: File | Blob, fileTypes: any | []) {
  const ext = getFileExt(file);
  const isTypeOk = fileTypes.some((type: string) => {
    if (file.type.indexOf(type) > -1) return true;
    if (ext && ext.indexOf(type) > -1) return true;
    return false;
  });
  return isTypeOk;
}

/**
 * @description: 前端下载文件
 * @param { String } file 文件：网络地址/base64/blod
 * @param { String } fileName 文件名字
 * @param { String } fileExt 文件后缀名
 * @param { String } strMimeType MIME content-type
 */
interface IDownLoadFile {
  file: string;
  fileName?: string | undefined;
  fileExt?: string | undefined;
  strMimeType?: string | undefined;
}
export function downloadFile({
  file,
  fileName,
  fileExt,
  strMimeType,
}: IDownLoadFile) {
  if (!file) throw new Error("file is undefined");
  const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
  const outFileName = fileName ? `${fileName}.${fileExt}` : "";
  // download netword file
  if (reg.test(file)) {
    if (fileName && !fileExt) throw new Error("fileExt is undefined");
    return downloadjs(file, outFileName);
  } else {
    return downloadjs(file, outFileName, strMimeType);
  }
}

/**
 * @description: 创建图片元素
 * @param {String} str 图片地址或者base64图片
 * @return {Promise} element 图片元素
 */
export function insertImgFile(str: string) {
  return new Promise((resolve) => {
    const imgEl = document.createElement("img");
    imgEl.src = str;
    // 插入页面
    document.body.appendChild(imgEl);
    imgEl.onload = () => {
      resolve(imgEl);
    };
  });
}

/**
 * Copying text to the clipboard
 * @param source Copy source
 * @param options Copy options
 * @returns Promise that resolves when the text is copied successfully, or rejects when the copy fails.
 */
export const clipboardText = async (
  source: string,
  options?: Parameters<typeof useClipboard>[0]
) => {
  try {
    await useClipboard({ source, ...options }).copy();
    Message.success("复制成功");
  } catch (error) {
    Message.error("复制失败");
    throw error;
  }
};

/**
 * 解析psd文件
 * @param file
 * @param onProcess
 */
export async function parsePsdFile(file: File, onProcess: Function) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result;
      try {
        // @ts-ignore
        const psd = readPsd(arrayBuffer);
        onProcess();
        // 更新图层列表
        const layers = psd.children;
        resolve({ psd, layers });
      } catch (e) {
        console.error(e);
        // @ts-ignore
        if (e.message.indexOf("Color mode not supported: CMYK") > -1) {
          reject({
            message: "暂不支持CMYK色彩模式的文件，请先使用PS转换为RGB",
          });
        } else {
          // @ts-ignore
          reject({ message: e.message });
        }
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * base 转 file
 * @param {*} data base64图片格式字符串
 * @param {*} fileName
 */
export function base64toFile(data: any, fileName: string = "") {
  const dataArr = data.split(",");
  const byteString = atob(dataArr[1]);
  const options: object = {
    type: "image/jpeg",
    endings: "native",
  };
  const u8Arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    u8Arr[i] = byteString.charCodeAt(i);
  }
  return new File([u8Arr], fileName + ".jpg", options); //返回文件流
}

/**
 * 返回网络图片base64
 * @param {*} imgUrl
 */
export function getBase64(imgUrl: string) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    fetch(imgUrl, {
      // @ts-ignore
      responseType: "blob",
    })
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        let oFileReader = new FileReader();
        oFileReader.onloadend = function (e: any) {
          // base64结果
          const base64 = e.target.result;
          resolve(base64);
        };
        oFileReader.readAsDataURL(blob);
      });
  });
}

/**
 * 加载网络字体
 * @param fontFamily
 * @param fontUrl
 * @returns
 */
export function loadFonts(fontFamily: string, fontUrl: string) {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      const font = new FontFace(fontFamily, `url(${fontUrl})`);
      await font.load();
      document.fonts.add(font);
      resolve();
    } catch (e) {
      reject();
    }
  });
}

/**
 * 生成二维码
 * @returns
 */
export function getQrCodeUrl(
  url: string,
  options: {
    errorCorrectionLevel: "H";
    margin: 4;
    scale: 4;
    color: {
      dark: "#000000ff";
      light: "#ffffffff";
    };
  },
  width: 100
): Promise<string> {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(url, { ...options, width: width }, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });
}