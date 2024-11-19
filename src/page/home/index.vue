<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="inline"
          :items="renderMenu(menuItems)"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          Bill is a cat.
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        WhatsApp Business API 测试开发
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// 响应式状态
const collapsed = ref(false); // 控制侧边栏折叠状态
const selectedKeys = ref<string[]>([]); // 当前选中的菜单项

// 获取路由实例
const router = useRouter();

// 过滤需要展示的路由（根据 meta 配置）
const menuItems = computed(() =>
    router.getRoutes().filter(route => route.meta && !route.meta.hidden)
);

// 递归生成菜单数据结构
const renderMenu = (routes: any[], level: number = 0) =>
    routes.map(route => {
      // 只处理有 meta.title 的有效菜单项
      if (!route.meta || !route.meta.title) return null;

      const menuItem: any = {
        key: route.path, // 菜单项唯一标识
        label: route.meta.title, // 菜单标题
      };

      // 如果是二级路由（子路由），只作为父路由的子菜单
      if (route.children && route.children.length > 0 && level === 0) {
        menuItem.children = renderMenu(route.children, 1); // 递归处理子菜单
      }

      // 仅返回一级菜单项，不显示为子菜单的路由项
      return level === 0 ? menuItem : null;
    }).filter(item => item !== null); // 过滤掉无效项

// const renderMenu = (routes: any[]) =>
//     routes
//         .filter(route => !route.parent) // 筛选一级路由（没有父路由的）
//         .map(route => {
//           const menuItem: any = {
//             key: route.path, // 菜单项唯一标识
//             label: route.meta.title, // 菜单标题
//           };
//
//           // 判断是否有子路由
//           const children = routes.filter(child => child.parent === route.name);
//           if (children.length > 0) {
//             menuItem.children = renderMenu(children); // 递归处理子菜单
//           }
//
//           return menuItem;
//         });


</script>

<style scoped>
/* Logo 样式 */
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

/* 默认背景色 */
.site-layout .site-layout-background {
  background: #fff;
}

/* 暗黑模式背景色 */
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>

