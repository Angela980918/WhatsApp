<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div class="logo" />
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" @click="handleClickMenu">
                <MenuItem :routes="routes"/>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0" />
            <a-layout-content style="margin: 0 16px; padding: 10px 0">
              <BreadcrumbItem/>
              <router-view />
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                WhatsApp Business API 测试开发
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import BreadcrumbItem from '@/components/Breadcrumb.vue';
import {computed} from "vue";

const route = useRoute();
const router = useRouter();
const routes = computed(() => {
    return router.getRoutes().filter((route) => {
        return route.meta?.toplevel == true;
    })
})
const handleClickMenu = (menmenuInfo) => {
    console.log("menmenuInfo",menmenuInfo)
    router.push({ path: menmenuInfo.key });
};

import { ref } from 'vue';
import MenuItem from "../../components/MenuItem.vue";
import Breadcrumb from "../../components/Breadcrumb.vue";
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['/home']);
</script>
<style scoped>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>
