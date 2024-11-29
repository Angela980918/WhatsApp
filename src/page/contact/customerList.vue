<script setup>
import {contactApi} from "@/api/ycloud/index.js";

const fetchContacts = async () => {
  const response = await contactApi.getContactList(1, 10, false,{
    tag: "tag1"
  })
  console.log('fetchContacts',response)
};

</script>

<template>
  客户列表
  <a-button @click="fetchContacts">fetchContacts</a-button>
</template>

<style scoped>

</style>