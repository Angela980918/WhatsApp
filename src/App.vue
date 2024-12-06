<template>
  <div>
      <router-view />
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
const router = useRouter();
</script>

<style scoped >
html, body {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}


</style>
