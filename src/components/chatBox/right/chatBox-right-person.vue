<template>
    <div style="padding: 12px;">個人資料</div>
</template>

<script setup>
import {useChatStore} from "@/store/chatStore.js";
import {computed, watch} from "vue";
const chatStore = useChatStore();

watch(() => chatStore.currentChatId, (newValue) => {
    console.log("newValue",newValue)
})

</script>

<style scoped>

</style>
