<script lang="ts" setup>
import {ref} from 'vue';
import {useCustomerStore} from "@/store/customerStore";

const value = ref<string>('');
const customerStore = useCustomerStore();
const onSearch = (searchValue: string) => {
    customerStore.setSearchWord(searchValue);
};
</script>

<template>
  <a-space direction="vertical" style="width: 100%;">
    <a-input-search
        name="customerPhone"
        v-model:value="value"
        placeholder="客戶名字或手機號碼"
        @search="onSearch"
        :allowClear="true"
    />
  </a-space>
</template>

<style scoped>

</style>
