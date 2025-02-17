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
import {useTempStore} from '@/store/useTempStore'
import {wsconnect, useMenuJump} from "@/tools"
import {storeToRefs} from "pinia";

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const customerStore = useCustomerStore();
const tempStore = useTempStore();
const menuStore = useMenuStore();
const { menupush } = useMenuJump();

// 路由list & menu菜单点击
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


onBeforeMount(() => {
    // 当前路由刷新，维系菜单打开状态
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
        let result = customerStore.getAllUnReadNum;
        updateTitle(result);
        showNotification(result);
    },
    { deep: true }
);

// 显示浏览器通知
const showNotification = (unreadCount) => {
    if (unreadCount > 0 && Notification.permission === 'granted') {
        new Notification('您有新消息', {
            body: `您有 ${unreadCount} 条未读消息`,
            // icon: '/path/to/icon.png', // 通知图标
        });
    }
};

onMounted(async () => {
  //   开启ws链接
  wsconnect.createConnect();

  //   加载模板列表
  await tempStore.loadTemplates();

  //   加载快捷用语
  await tempStore.loadQuickMsg();

  //   加载快捷用语(固定首先加载登入用户所在公司的公共素材)
  await tempStore.setMaterialListData('wabaId=449711484896804');
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
