
<template>
  <div>
      <router-view />
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";

import {onMounted} from "vue";

const router = useRouter();

onMounted(() => {
    // const userAgent = navigator.userAgent;
    // console.log("userAgent",userAgent)
})

</script>

<style scoped >
html, body {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}


</style>
