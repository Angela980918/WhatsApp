<template>
    <a-list-item v-if="item.position == 'inbound'">
        <a-space size="middle" align="end">
            <a-avatar size="large" src="https://randomuser.me/api/portraits/women/7.jpg"/>
            <a-list-item-meta class="list-item-content" :description="item.time">
                <template #title>
                    <span>{{ item.title }}</span>
                </template>
            </a-list-item-meta>
        </a-space>
    </a-list-item>
</template>

<script setup>
import {defineProps} from "vue";

const props = defineProps({
    item: {
        type: Object,
        default: "horizontal"
    },
});
console.log("props",props)

</script>

<style scoped>

.list-item-left {
    text-align: start;
    justify-self: start;
}

.list-item-content {
    flex: unset;
    width: unset;
    padding: 8px;
    border-radius: 8px;
    background: #ffffff;
    min-width: 200px;
    text-align: start;
}

</style>
