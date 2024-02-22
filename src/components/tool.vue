<template>
  <div class="wrap">
    <div class="header">{{ $t("codeType.name") }}</div>
    <div class="item" @click="addQrcode">
      <div class="icon">
        <svg
          t="1708500553042"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4346"
          width="200"
          height="200"
        >
          <path
            d="M597.333333 597.333333h85.333334v-85.333333h85.333333v128h-85.333333v42.666667h-85.333334v-42.666667h-85.333333v-128h85.333333v85.333333z m-384-85.333333h256v256H213.333333v-256z m85.333334 85.333333v85.333334h85.333333v-85.333334H298.666667zM213.333333 213.333333h256v256H213.333333V213.333333z m85.333334 85.333334v85.333333h85.333333V298.666667H298.666667z m213.333333-85.333334h256v256h-256V213.333333z m85.333333 85.333334v85.333333h85.333334V298.666667h-85.333334z m85.333334 384h85.333333v85.333333h-85.333333v-85.333333z m-170.666667 0h85.333333v85.333333h-85.333333v-85.333333z"
            fill="#444444"
            p-id="4347"
          ></path>
        </svg>
      </div>
      <div class="text">
        <span>{{ $t("codeType.qrCodeName") }}</span>
        <span class="desc">{{ $t("codeType.qrCodeDesc") }}</span>
      </div>
    </div>
    <div class="item" @click="addBarcode">
      <div class="icon">
        <svg
          t="1708500640329"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5366"
          width="200"
          height="200"
        >
          <path
            d="M910.613 200.188H1024V823.81H910.613zM540.613 200.188H654V823.81H540.613zM0 200.188h56.693V823.81H0zM84.173 200.188h28.347V823.81H84.173zM144.173 200.188h28.347V823.81h-28.347zM206.173 200.188h28.347V823.81h-28.347zM361.653 200.188H390V823.81h-28.347zM421.653 200.188H450V823.81h-28.347zM483.653 200.188H512V823.81h-28.347zM691.653 200.188H720V823.81h-28.347zM753.653 200.188H782V823.81h-28.347zM262 200.188h56.693V823.81H262zM814 200.188h56.693V823.81H814z"
            fill=""
            p-id="5367"
          ></path>
        </svg>
      </div>
      <div class="text">
        <span>{{ $t("codeType.barCodeName") }}</span>
        <span class="desc">{{ $t("codeType.barCodeDesc") }}</span>
      </div>
    </div>
  </div>
</template>

<script setup name="tool">
import useSelect from "@/hooks/select";
import { v4 as uuid } from "uuid";
import { getQrCodeUrl } from "@/utils/utils";
import JsBarcode from "jsbarcode";

const { fabric, canvasEditor } = useSelect();

// 插入图片文件
function insertImgFile(file) {
  if (!file) throw new Error("file is undefined");
  const imgEl = document.createElement("img");
  imgEl.src = file;
  // 插入页面
  document.body.appendChild(imgEl);
  imgEl.onload = () => {
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      name: "qrcode",
      left: 100,
      top: 100,
    });
    // 设置缩放
    canvasEditor.canvas.add(imgInstance);
    canvasEditor.canvas.setActiveObject(imgInstance);
    canvasEditor.canvas.renderAll();
    // 删除页面中的图片元素
    imgEl.remove();
  };
}

const addQrcode = async () => {
  let str = "https://github.com/missxiaolin"
  let imgUrl = await getQrCodeUrl(str);
  if (!imgUrl) throw new Error("file is undefined");
  const imgEl = document.createElement("img");
  imgEl.src = imgUrl;
  // 插入页面
  document.body.appendChild(imgEl);
  imgEl.onload = () => {
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      codeValue: str,
      name: "qrcode",
      left: 100,
      top: 100,
    });
    // 设置缩放
    canvasEditor.canvas.add(imgInstance);
    canvasEditor.canvas.setActiveObject(imgInstance);
    canvasEditor.canvas.renderAll();
    // 删除页面中的图片元素
    imgEl.remove();
  };
};

const addBarcode = () => {
  let str = '123456789'
  // 创建一个空的图片元素用于渲染条形码
  const imgEl = document.createElement("img");
  // 调用 JsBarcode 库的方法生成条形码
  JsBarcode(imgEl, str);

  // 将条形码图片 URL 赋值给图片元素的 src 属性
  const barcodeImageUrl = imgEl.src;
  console.log(barcodeImageUrl)
  // 将图片元素添加到页面上的某个容器中
  document.body.appendChild(imgEl);
  imgEl.onload = () => {
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      codeValue: str,
      name: "barcode",
      left: 100,
      top: 100,

    });
    // 设置缩放
    canvasEditor.canvas.add(imgInstance);
    canvasEditor.canvas.setActiveObject(imgInstance);
    canvasEditor.canvas.renderAll();
    // 删除页面中的图片元素
    imgEl.remove();
  };
};
</script>

<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
}
.header {
  padding: 17px 1rem;
  height: 56px;
  display: flex;
  position: relative;
  font-size: 16px;
  color: #333333;
  font-weight: bold;
  display: flex;
  align-items: center;
  user-select: none;
}
.item {
  opacity: 0.85;
  position: relative;
  border-radius: 4px;
  font-size: 15px;
  color: #33383e;
  align-items: center;
  cursor: pointer;
  margin: 0 10px 16px;
  user-select: none;
  background-color: #f6f7f9;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  padding: 10px;
}
.item:hover {
  opacity: 1;
}
.item-disabled {
  cursor: no-drop;
}
.item-disabled:hover {
  opacity: 0.85;
}
.icon {
  margin-right: 5px;
  width: 50px;
  height: 50px;
}
.text {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.desc {
  padding-top: 0.5rem;
  color: #7f8792;
  font-size: 12px;
}
</style>
