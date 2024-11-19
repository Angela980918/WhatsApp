import { createRouter, createWebHistory } from 'vue-router'
import contactRoutes from '@/router/contactRoute.js';
import marketingRoutes from "@/router/marketingRoute.js";

const routes = [
    {
        // 主菜单栏
        path: '/',
        redirect: '/menu',
    },
    {
        // 主菜单栏
        path: '/menu',
        name: 'menu',
        component: ()=> import('@/page/menu/index.vue')
    },
    {
        // 首頁
        path: '/home',
        name: 'home',
        component: ()=> import('@/page/home/index.vue')
    },
    {
        // 在綫聊天
        path: '/chat',
        name: 'chat',
        component: ()=> import('@/page/chat/index.vue')
    },
    ...contactRoutes,
    ...marketingRoutes,
]

const router = createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router
