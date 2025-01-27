<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <a-menu theme="dark" mode="inline" @click="handleClickMenu">
        <MenuItem/>
      </a-menu>
      <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="dark" mode="inline" @click="handleClickMenu">
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
import {computed, onBeforeMount, onMounted, ref, watch} from "vue";
import MenuItem from "@/components/MenuItem.vue";
import {useChatStore} from "@/store/chatStore";
import {useMenuStore} from "@/store/useMenuStore";
import {useCustomerStore} from "@/store/customerStore"
import {wsconnect, useMenuJump} from "@/tools"
import {storeToRefs} from "pinia";

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();
const { menupush } = useMenuJump();
const routes = computed(() => {
  return router.getRoutes().filter((route) => {
    return route.meta?.toplevel == true;
  })
})
const handleClickMenu = (menmenuInfo) => {
    menupush(menmenuInfo.key);
};

const collapsed = ref<boolean>(false);

const { selectedKeys, openKeys } = storeToRefs(menuStore)
// const openKeys = computed(() => menuStore.openKeys);

const chatStore = useChatStore();
const customerStore = useCustomerStore();

onBeforeMount(() => {
    const pathname = window.location.pathname;
    menupush(pathname);
})


// 动态更新页面标题
const updateTitle = (unreadCount) => {
    if (unreadCount > 0) {
        document.title = `(${unreadCount}) 未读消息 - WhatsApp`;
    } else {
        document.title = 'WhatsApp平台';
    }
};

// 监听未读消息变化
watch(
    [() => customerStore.assignedCustomers],
    () => {
        console.log("测试");
        let result = customerStore.getAllUnReadNum;
        updateTitle(result);
        showNotification(result);
    },
    { deep: true } // 深度监听
);

// 显示浏览器通知（可选）
const showNotification = (unreadCount) => {
    if (unreadCount > 0 && Notification.permission === 'granted') {
        new Notification('您有新消息', {
            body: `您有 ${unreadCount} 条未读消息`,
            // icon: '/path/to/icon.png', // 通知图标
        });
    }
};

onMounted(() => {
  wsconnect.createConnect();
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
