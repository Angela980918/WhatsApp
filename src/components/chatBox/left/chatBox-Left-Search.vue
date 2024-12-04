<script lang="ts" setup>
import {ref} from 'vue';

const value = ref<string>('');
const onSearch = (searchValue: string) => {
  console.log('use value', searchValue);
  console.log('or use this.value', value.value);
};
</script>

<template>
  <a-space direction="vertical" style="width: 100%;">
    <a-input-search
        v-model:value="value"
        placeholder="客戶名字或手機號碼"
        @search="onSearch"
        :allowClear="true"
    />
  </a-space>
</template>

<style scoped>

</style>