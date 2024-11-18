import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import {createPinia} from "pinia";
import router from "@/router/router.js";

const app = createApp();
const pinia = createPinia();


app.use(router)
    .use(pinia)
    .use(Antd)
    .mount('#app')
