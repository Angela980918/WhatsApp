import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
// import 'ant-design-vue/dist/antd';
import {createPinia} from "pinia";
import router from "@/router/router.js";

const app = createApp(App);
const pinia = createPinia();

app.use(router)
    .use(pinia)
    .use(Antd)
    .mount('#app')
