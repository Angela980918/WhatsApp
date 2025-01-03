<template>
  <div class="bread-crumb">
    <a-breadcrumb>
      <!-- 遍历当前路由中的所有面包屑项 -->
      <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
        <router-link :to="item.path">
          <!-- 如果有图标，显示图标 -->
          <component v-if="item.icon" :is="item.icon"/>
          <!-- 显示文本 -->
          <span>{{ item.title }}</span>
        </router-link>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';

// 获取当前路由
const route = useRoute();

// console.log(route)

// 计算面包屑列表
const breadcrumbList = computed(() => {
  const breadcrumbArray: { title: string, path: string, icon: any }[] = [];
  let currentRoute = route;

  // 遍历路由信息，构建面包屑列表
  while (currentRoute) {
    if (currentRoute.meta?.title) {
      breadcrumbArray.unshift({
        title: currentRoute.meta.title,
        path: currentRoute.path,
        icon: currentRoute.meta.icon || null,  // 如果有图标，获取图标
      });
    }
    // 获取父路由信息
    currentRoute = currentRoute.matched[currentRoute.matched.length - 1]?.parent;

  }

  return breadcrumbArray;
});
</script>

<style scoped>
.bread-crumb {
  height: 30px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  margin: 10px 0;
}
</style>
