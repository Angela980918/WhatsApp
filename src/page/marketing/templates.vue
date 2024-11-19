
<template>
    <a-flex gap="middle" vertical>
        <a-radio-group v-model:value="value">
            <a-radio value="horizontal">horizontal</a-radio>
            <a-radio value="vertical">vertical</a-radio>
        </a-radio-group>
        <a-flex :vertical="value === 'vertical'">
            <div
                    v-for="(item, index) in new Array(4)"
                    :key="item"
                    :style="{ ...baseStyle, background: `${index % 2 ? '#1677ff' : '#1677ffbf'}` }"
            />
        </a-flex>
    </a-flex>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('horizontal');

</script>

<style scoped>

</style>
