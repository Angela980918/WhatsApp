import {createRouter, createWebHistory} from 'vue-router'
import contactRoutes from '@/router/contactRoute.js';
import marketingRoutes from "@/router/marketingRoute.js";

const routes = [
    {
        // 從定向
        path: '/',
        component: () => import('@/page/menu/index.vue'),
        children: [
            {
                // 首頁
                path: '/home',
                name: 'home',
                component: () => import('@/page/home/index.vue'),
                meta: {title: '首頁', icon: 'HomeOutlined', toplevel: true},
            },
            {
                // 在綫聊天
                path: '/chat',
                name: 'chat',
                component: () => import('@/page/chat/index.vue'),
                meta: {title: '對話', icon: 'MessageOutlined', toplevel: true},
            },
            ...contactRoutes,
            ...marketingRoutes,
            {
                // 聊天機器人
                path: '/chatbot',
                name: 'chatbot',
                component: () => import('@/page/chatbot/index.vue'),
                meta: {title: 'Live Chat', icon: 'RobotOutlined', toplevel: true},
            },
            {
                // 公司
                path: '/report',
                name: 'report',
                component: () => import('@/page/report/index.vue'),
                meta: {title: '報告', icon: 'FileTextOutlined', toplevel: true},
            },
            {
                // 公司
                path: '/company',
                name: 'company',
                component: () => import('@/page/company/index.vue'),
                meta: {title: '公司', icon: 'RocketOutlined', toplevel: true},
            },
        ],
    },
]


const router = createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior() {
        return {top: 0}
    }
})

export default router
