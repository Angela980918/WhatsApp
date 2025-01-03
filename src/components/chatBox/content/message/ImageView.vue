<template>
    <div class="preview-modal"  v-if="props.visiable" @click="emits('handleChange')">
        <img :src="props.imgUrl" class="preview-image" />
    </div>
</template>
<script setup>
import {defineProps} from "vue";
const emits = defineEmits(['handleChange'])
const props = defineProps({
    imgUrl: {
        type: String,
        default: ""
    },
    visiable: {
        type: Boolean,
        default: false
    }
});
// console.log("props",props)
</script>
<style scoped>
.preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; }
.preview-image {
    max-width: 90%;
    max-height: 90%;
}
</style>
