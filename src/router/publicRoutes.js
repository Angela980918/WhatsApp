// src/router/publicRoutes.js
const publicRoutes = [{
    path: "/login",
    name: "login",
    component: () => import("@/page/home/index.vue"),
    meta: {title: "登录", hidden: true},
}, {
    path: "/404", name: "404", component: () => import("@/page/home/index.vue"), meta: {title: "404", hidden: true}
}];

export default publicRoutes;
