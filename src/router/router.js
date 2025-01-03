import {createRouter, createWebHistory} from 'vue-router'
import contactRoutes from '@/router/contactRoute.js';
import marketingRoutes from "@/router/marketingRoute.js";
import {dynamicRoutes} from "@/router/dynamicRoutes.js";
import publicRoutes from "@/router/publicRoutes.js";
import { useMenuStore } from "@/store/useMenuStore";
import { useMenuJump } from "@/tools/modules/menujump.js";

const routes = [
    ...dynamicRoutes,
    ...publicRoutes,
]


const router = createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior() {
        return {top: 0}
    }
})

router.beforeEach((to, from, next) => {
    // console.log('导航操作触发');
    const isBackNavigation = window.history.state?.back;
    const { menupush } = useMenuJump();
    if (isBackNavigation) {
        // console.log('检测到后退操作', to.fullPath);
        menupush(to.fullPath, true);
        // const menuStore = useMenuStore(); // 确保在上下文中调用
        // menupushWithoutContext(to.fullPath, router.getRoutes(), menuStore);
    }
    next();
});

export default router
