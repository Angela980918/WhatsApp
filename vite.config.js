import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from 'node:url';

// 按需引入
import Components from 'unplugin-vue-components/vite'
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers'


export default defineConfig({
    plugins: [
        Components({
            resolvers: [AntDesignVueResolver({
                importStyle: "less"
            })]
        }),
        vue()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)), // 配置 @ 指向 src
        },
    },
    css: {
    }
})
