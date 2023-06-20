/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  declare module 'fabric/fabric-impl' {
    interface IObjectOptions {
      /**
       * 标识
       */
      id?: string | undefined;
    }
  }
}

export as namespace vfe;
declare module 'vfe' {
  export as namespace vfe;
  export interface ICanvas extends fabric.Canvas {
    c: fabric.Canvas;
    editor: Editor;
  }
}