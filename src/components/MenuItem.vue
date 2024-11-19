<template>
    <template v-for="item in routes" :key="item.path">
        <a-menu-item
                :key="item.path"
                v-if="!item.children || item.children.length === 0"
        >
            <component :is="resolveIcon(item.meta?.icon)"/>
            <span>{{item.meta?.title}}</span>
        </a-menu-item>
        <template v-else>
            <a-sub-menu :key="item.path">
                <template #title>
                    <component :is="resolveIcon(item.meta?.icon)" />
                    <span>{{item.meta?.title}}</span>
                </template>
                <MenuItem :routes="item.children"/>
            </a-sub-menu>
        </template>
    </template>
</template>

<script setup>
import * as Icons from '@ant-design/icons-vue';
const props = defineProps({
    routes: {
        type: Array, // 根据 Vue Router 的 API，routes 是一个数组
        default: () => [], // 默认返回空数组
    },
});
function resolveIcon(iconName) {
    if (!iconName) return null; // 如果没有 icon 配置，返回 null
    const iconComponent = Icons[iconName]; // 从导入的 Icons 中查找对应的图标
    return iconComponent || Icons['QuestionOutlined']; // 如果未找到图标，默认返回一个占位图标
}
console.log("props",props.routes)
</script>

<style scoped>

</style>
