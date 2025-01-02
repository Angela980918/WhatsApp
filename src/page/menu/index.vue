<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <a-menu theme="dark" mode="inline" @click="handleClickMenu">
        <MenuItem/>
      </a-menu>
      <a-menu v-model:selectedKeys="selectedKeys" :open-keys="openKeys" theme="dark" mode="inline" @click="handleClickMenu">
        <MenuItem :routes="routes"/>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 0; padding: 10px 0">
        <BreadcrumbItem/>
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import BreadcrumbItem from '@/components/Breadcrumb.vue';
import {computed, onBeforeMount, onMounted, ref} from "vue";
import MenuItem from "@/components/MenuItem.vue";
import {useChatStore} from "@/store/chatStore";
import {wsconnect} from "@/tools"

const route = useRoute();
const router = useRouter();
const routes = computed(() => {
  return router.getRoutes().filter((route) => {
    return route.meta?.toplevel == true;
  })
})
const handleClickMenu = (menmenuInfo) => {
  console.log("menmenuInfo", menmenuInfo)
  router.push({path: menmenuInfo.key});
};

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['/home']);
const openKeys = ref<string[]>(['/marketing'])

const chatStore = useChatStore();

onBeforeMount(() => {
    const pathname = window.location.pathname;
    router.push({path: pathname});
    selectedKeys.value = [pathname]
})

onMounted(() => {
  // wsconnect.createConnect();
})
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
