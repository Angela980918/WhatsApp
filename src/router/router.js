import {createRouter, createWebHistory} from 'vue-router'
import contactRoutes from '@/router/contactRoute.js';
import marketingRoutes from "@/router/marketingRoute.js";
import {dynamicRoutes} from "@/router/dynamicRoutes.js";
import publicRoutes from "@/router/publicRoutes.js";

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

export default router
