<script setup>
import { getContactList } from '@/api/ycloud.js'

const fetchContacts = async () => {
  const response = await getContactList({page: 1, limit: 10, includeTotal: false});
  console.log('fetchContacts',response)
};

</script>

<template>
  客户列表
  <a-button @click="fetchContacts">fetchContacts</a-button>
</template>

<style scoped>

</style>