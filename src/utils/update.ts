import { getOptions } from "./oss";
import { base64toFile } from './utils'

/**
 * base64 oss 上传
 * @param {*} imgBase64
 * @param {*} ossOptions
 * @param {*} cal
 */
export function ossUpdateBase64Update(imgBase64: string, ossOptions: any, cal: any): void{
  let options: any = getOptions(ossOptions, {
    name: "dx.jpg",
  });
  let file = base64toFile(imgBase64);
  let formData = new FormData();
  formData.append("success_action_status", options.success_action_status);
  formData.append("AccessKeySecret", options.AccessKeySecret);
  formData.append("key", options.key);
  formData.append("OSSAccessKeyId", options.OSSAccessKeyId);
  formData.append("signature", options.signature);
  formData.append("policy", options.policy);
  formData.append("x-oss-security-token", options["x-oss-security-token"]);
  formData.append("file", file);
  // axios
  //   .post(updateBaseUrl, formData, { "content-type": "multipart/form-data" })
  //   .then((res) => {
  //     if (res.status == 200) {
  //       cal(`${cdnUrl}/${options.key}`);
  //     }
  //   });
}
