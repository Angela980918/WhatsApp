import { createRouter, createWebHistory } from 'vue-router'
import contactRoutes from '@/router/contactRoute.js';
import marketingRoutes from "@/router/marketingRoute.js";

const routes = [
    {
        // 從定向
        path: '/',
        component: ()=> import('@/page/menu/index.vue'),
        children: [
            {
                // 首頁
                path: '/home',
                name: 'home',
                component: ()=> import('@/page/home/index.vue'),
                meta: { title: '首頁', icon: 'HomeOutlined', toplevel: true},
            },
            {
                // 在綫聊天
                path: '/chat',
                name: 'chat',
                component: ()=> import('@/page/chat/index.vue'),
                meta: { title: '在綫聊天', icon: 'MessageOutlined', toplevel: true},
            },
            ...contactRoutes,
            ...marketingRoutes,
        ],
    },
]


const router = createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router
