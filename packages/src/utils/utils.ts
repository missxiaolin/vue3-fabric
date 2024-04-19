// 工具文件

import { useClipboard, useFileDialog, useBase64 } from "@vueuse/core";
import { Message } from "view-ui-plus";
import { readPsd } from "ag-psd";

/**
 * @description: 图片文件转字符串
 * @param {Blob|File} file 文件
 * @return {String}
 */
export function getImgStr(file: File | Blob): Promise<FileReader["result"]> {
  return useBase64(file).promise.value;
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
export function checkFileExt(file: any, fileTypes: any | []) {
  const ext = getFileExt(file);
  const isTypeOk = fileTypes.some((type: string) => {
    if (file.type.indexOf(type) > -1) return true;
    if (ext && ext.indexOf(type) > -1) return true;
    return false;
  });
  return isTypeOk;
}

export default {
  getImgStr,
  selectFiles,
  insertImgFile,
  clipboardText,
};
