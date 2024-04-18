import { defineConfig } from 'vite';
import { resolve } from 'path';

const config = () => {
  return {
    base: './',
    build: {
      lib: {
        entry: resolve(__dirname, './core/index.ts'),
        name: 'CoreFabric',
        fileName: 'index',
      },
      outDir: resolve(__dirname, './dist'),
    },
    plugins: []
  };
};

export default defineConfig(config);
